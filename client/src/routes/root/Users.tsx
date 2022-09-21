import { useContext } from 'react'
import SocketContext from 'contexts/Socket/Context'
import { UserItem } from './UserItem'

export interface IUsersProps {}

export const Users: React.FunctionComponent<IUsersProps> = () => {
  const { users, socket } = useContext(SocketContext).SocketState

  const otherUsersExceptMe = users.filter(({ sid }) => sid !== socket!.id)

  return (
    <>
      <h4>users online</h4>
      <ul>
        {otherUsersExceptMe.map(({ name, sid }) => (
          <UserItem name={name} sid={sid} />
        ))}
      </ul>
    </>
  )
}
