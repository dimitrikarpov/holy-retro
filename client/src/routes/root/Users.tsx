import { ProfileContext } from 'contexts/profile/profileContext'
import SocketContext from 'contexts/socket/SocketContext'
import { useContext } from 'react'
import { UserItem } from './UserItem'

export interface IUsersProps {}

export const Users: React.FunctionComponent<IUsersProps> = () => {
  const { users, socket } = useContext(SocketContext).SocketState

  const { name } = useContext(ProfileContext)

  const otherUsersExceptMe = users.filter(({ sid }) => sid !== socket!.id)

  return (
    <>
      <p>my name is: {name}</p>
      <h4>users online</h4>
      <ul>
        {otherUsersExceptMe.map(({ name, sid }) => (
          <UserItem name={name} sid={sid} key={sid} />
        ))}
      </ul>
    </>
  )
}
