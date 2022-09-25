import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import Peer from 'simple-peer'
import { Socket } from 'socket.io-client'
import { useSocket } from '../../hooks/useSocket'
import SocketContext, {
  defaultSocketContextState,
  SocketReducer,
  TUser,
} from './Context'

let peers: Record<string, Peer.Instance> = {}
let streams: MediaStream[] = []

let peer: Peer.Instance
let stream: MediaStream

interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketProvider: FunctionComponent<ISocketContextComponentProps> = ({
  children,
}) => {
  const navigate = useNavigate()

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
    SocketDispatch({ type: 'socket:set', payload: socket })

    /** Start event listeners */
    StartListeners()

    /** Send the handshake */
    SendHandshake()

    // eslint-disable-next-line
  }, [])

  const StartListeners = () => {
    socket.on('user_connected', (user: TUser) => {
      console.info('User connected')

      SocketDispatch({ type: 'users:add', payload: user })
    })

    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected, user id recieved', uid)

      SocketDispatch({ type: 'users:remove', payload: uid })
    })

    // ************************************************************** //

    socket.on('peer:prepare-player', ({ managerSocketId }) => {
      console.log('on PLAYER PREPARE', managerSocketId)

      const configuration = getConfiguration()

      peer = new Peer({
        config: configuration,
        initiator: false,
      })

      peer.on('connect', () => {
        console.log('')
      })

      socket.emit('peer:prepare-manager', { managerSocketId })

      SocketDispatch({ type: 'role:set', payload: 'player' })

      navigate('/player')
    })

    socket.on('peer:prepare-manager', ({ playerSocketId }) => {
      console.log('on MANAGER PREPARE', playerSocketId)

      const configuration = getConfiguration()

      peer = new Peer({
        config: configuration,
        initiator: true,
      })

      peer.on('signal', (data) => {
        socket.emit('peer:signal-player', { data, sid: playerSocketId })
      })

      SocketDispatch({ type: 'role:set', payload: 'manager' })

      navigate('/create')
    })

    socket.on('peer:signal-player', (data: Peer.SignalData) => {
      peer.signal(data)
    })

    // ************************************************************** //

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
        type: 'users:update',
        payload: users,
      })

      setLoading(false)
    })
  }

  if (loading) return <p>loading socket.io ...</p>

  return (
    <SocketContext.Provider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider

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

export const preparePeerConnection = (
  sid: string,
  isInitiator: boolean,
  socket: Socket
) => {
  const configuration = getConfiguration()

  peer = new Peer({
    config: configuration,
    initiator: true,
  })

  console.log('PEER', peer)

  peer.on('signal', (data) => {
    //

    console.log('SIGNAL DATA', data)
  })
}
