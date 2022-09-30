import { useContext } from 'react'
import SocketContext from 'contexts/socket/SocketContext'
import { UserItem } from './UserItem'

export const Users = () => {
  const { users, socket } = useContext(SocketContext).SocketState

  const otherUsersExceptMe = users.filter(({ sid }) => sid !== socket!.id)

  return (
    <>
      <h4>users online</h4>
      <ul>
        {otherUsersExceptMe.map(({ name, sid }) => (
          <UserItem name={name} sid={sid} key={sid} />
        ))}
      </ul>
    </>
  )
}
