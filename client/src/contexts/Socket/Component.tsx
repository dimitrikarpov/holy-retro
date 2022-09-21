import { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import Peer from 'simple-peer'
import { Socket } from 'socket.io-client'
import { useSocket } from '../../hooks/useSocket'
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
  TUser,
} from './Context'

let peers: Record<string, Peer.Instance> = {}
let streams: MediaStream[] = []

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  )
  const [loading, setLoading] = useState(true)

  const socket = useSocket('ws://localhost:1337', {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
  })

  useEffect(() => {
    /** Connect to the Web Socket */
    socket.connect()

    /** Save socket inside context */
    SocketDispatch({ type: 'update_socket', payload: socket })

    /** Start event listeners */
    StartListeners()

    /** Send the handshake */
    SendHandshake()

    // eslint-disable-next-line
  }, [])

  const StartListeners = () => {
    /** User connected event */
    socket.on('user_connected', (user: string) => {
      console.info('User connected')

      SocketDispatch({ type: 'add_user', payload: user })
    })

    /** User disconnected event */
    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected, user id recieved', uid)

      SocketDispatch({ type: 'remove_user', payload: uid })
    })

    socket.on('conn-prepare', (data) => {
      const { connUserSocketId } = data

      prepareNewPeerConnection(connUserSocketId, false, socket) // disable for a while

      // const configuration = {
      //   iceServers: [
      //     {
      //       urls: 'stun:stun.l.google.com:19302',
      //     },
      //   ],
      // }

      // peers[connUserSocketId] = new Peer({
      //   initiator: false,
      //   config: configuration,
      //   // stream: localStream // emulator should be ready
      // })

      // peers[connUserSocketId].on('signal', (data) => {
      //   const signalData = {
      //     signal: data,
      //     connUserSocketId: connUserSocketId,
      //   }

      //   socket.emit('conn-signal', signalData)
      // })

      // peers[connUserSocketId].on('stream', (stream) => {
      //   streams.push(stream)

      //   // addStream
      //   // display incoming stream
      // })

      // inform the user which join the room that we have prepared for incoming connection
      socket.emit('conn-init', { connUserSocketId })
    })

    socket.on('conn-signal', (data) => {
      // add signaling data to peer connection
      const { connUserSocketId } = data

      peers[connUserSocketId].signal(data.signal)
    })

    socket.on('conn-init', (data) => {
      const { connUserSocketId } = data

      prepareNewPeerConnection(connUserSocketId, true, socket) // temporaly disabled
    })

    /** Reconnect event */
    socket.io.on('reconnect', (attempt) => {
      console.log('Reconnecting on attempt' + attempt)
    })

    /** Reconnect attempt */
    socket.io.on('reconnect_attempt', (attempt) => {
      console.log('Reconnecting attempt' + attempt)
    })

    /** Reconnection error */
    socket.io.on('reconnect_error', (error) => {
      console.log('Reconnection error: ', error)
    })

    /** Reconnection failed */
    socket.io.on('reconnect_failed', () => {
      console.log('Reconnection failure')

      alert('We are unable to connec you to web socket')
    })
  }

  const SendHandshake = () => {
    console.log('Sending handshake to server...')

    socket.emit('handshake', (users: TUser[]) => {
      console.log('User handshake callback message recieved', users)

      SocketDispatch({
        type: 'update_users',
        payload: users,
      })

      setLoading(false)
    })
  }

  if (loading) return <p>loading socket.io ...</p>

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  )
}

export default SocketContextComponent

const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  }
}

export const prepareNewPeerConnection = (
  connUserSocketId: string,
  isInitiator: boolean,
  socket: Socket
) => {
  const configuration = getConfiguration()

  peers[connUserSocketId] = new Peer({
    config: configuration,
    initiator: isInitiator,
    // stream: localStream,
  })

  peers[connUserSocketId].on('signal', (data) => {
    /** webrtc offer, werbrtc answer (SDP informations), ice candidates */
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    }

    // wss.signalPeerData(signalData)
    socket.emit('conn-signal', signalData)
  })

  peers[connUserSocketId].on('stream', (stream) => {
    console.log('new stream came')

    // addStream(stream, connUserSocketId)
    // streams = [...streams, stream]
  })
}
