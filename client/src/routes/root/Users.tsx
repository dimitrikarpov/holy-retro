import { useContext } from 'react'
import SocketContext from 'contexts/Socket/Context'
import { UserItem } from './UserItem'

export interface IUsersProps {}

export const Users: React.FunctionComponent<IUsersProps> = () => {
  const { users } = useContext(SocketContext).SocketState

  return (
    <ul>
      {users.map((user) => (
        <UserItem name={user} />
      ))}
    </ul>
  )
}
