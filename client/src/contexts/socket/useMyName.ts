import { useContext } from 'react'
import SocketContext from './SocketContext'

export const useMyName = () => {
  const { users, socket } = useContext(SocketContext).SocketState

  return users.find(({ sid }) => sid === socket?.id)?.name
}
