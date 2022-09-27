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
import { useSocket } from './useSocket'
import SocketContext, {
  defaultSocketContextState,
  SocketReducer,
  TUser,
} from './Context'
import { getConfiguration } from './getConfiguration'

let peers: Record<string, Peer.Instance> = {}
let streams: MediaStream[] = []

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
    socket.connect()

    SocketDispatch({ type: 'socket:set', payload: socket })

    subscribe()

    socket.emit('handshake', (users: TUser[]) => {
      SocketDispatch({
        type: 'users:update',
        payload: users,
      })

      setLoading(false)
    })
    // eslint-disable-next-line
  }, [])

  const subscribe = () => {
    /**  ----- User events ----- */

    socket.on('user_connected', (user: TUser) => {
      console.info('User connected')

      SocketDispatch({ type: 'users:add', payload: user })
    })

    socket.on('user_disconnected', (uid: string) => {
      console.info('User disconnected, user id recieved', uid)

      SocketDispatch({ type: 'users:remove', payload: uid })
    })

    /** ----- Peer events ----- */

    socket.on('peer:prepare', ({ sid }) => {
      console.log('[peer:prepare]')

      addPeer(sid, false, socket)

      socket.emit('peer:init', { sid })
    })

    socket.on('peer:init', ({ sid }) => {
      console.log('[peer:init]')

      addPeer(sid, true, socket)
    })

    socket.on('peer:signal', ({ data, sid }) => {
      console.log('[peer:signal]')

      peers[sid].signal(data)
    })

    /** ----- Reconnect events ----- */

    socket.io.on('reconnect', (attempt) => {
      console.log('Reconnecting on attempt' + attempt)
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log('Reconnecting attempt' + attempt)
    })

    socket.io.on('reconnect_error', (error) => {
      console.log('Reconnection error: ', error)
    })

    socket.io.on('reconnect_failed', () => {
      console.log('Reconnection failure')
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

const addPeer = (sid: string, initiator: boolean, socket: Socket) => {
  const configuration = getConfiguration()

  const SimplePeerGlobal = window.SimplePeer

  peers[sid] = new SimplePeerGlobal({
    config: configuration,
    initiator,
  })

  peers[sid].on('signal', (data) => {
    socket.emit('peer:signal', { data, sid })
  })

  peers[sid].on('connect', () => {
    console.log('connected with', sid)
  })

  peers[sid].on('data', (chunk) => {
    console.log('DATA:', chunk)
  })

  console.log({ peers })
}
