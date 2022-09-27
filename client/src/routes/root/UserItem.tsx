import { FunctionComponent, useContext } from 'react'
import SocketContext from 'contexts/Socket/Context'

interface IUserItemProps {
  name: string
  sid: string
}

export const UserItem: FunctionComponent<IUserItemProps> = ({ name, sid }) => {
  const {
    SocketState: { socket },
  } = useContext(SocketContext)

  const onClick = () => {
    socket?.emit('peer:prepare')
  }

  return (
    <div>
      <p onClick={onClick}>{name}</p>
    </div>
  )
}
