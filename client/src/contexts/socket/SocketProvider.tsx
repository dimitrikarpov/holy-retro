import {
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { useSocket } from './useSocket'
import SocketContext, {
  defaultSocketContextState,
  SocketReducer,
  TUser,
} from './SocketContext'
import { ProfileContext } from 'contexts/profile/profileContext'

interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketProvider: FunctionComponent<ISocketContextComponentProps> = ({
  children,
}) => {
  const { name } = useContext(ProfileContext)

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

    socket.emit('handshake', name, (users: TUser[]) => {
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
