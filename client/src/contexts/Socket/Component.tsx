import { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { useSocket } from '../../hooks/useSocket'
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from './Context'

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

    socket.emit('handshake', (users: string[], ownName: string) => {
      console.log('User handshake callback message recieved', users, ownName)

      SocketDispatch({ type: 'update_name', payload: ownName })
      SocketDispatch({
        type: 'update_users',
        payload: users.filter((name) => name !== ownName),
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
