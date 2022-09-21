import { useContext } from 'react'
import SocketContext from 'contexts/Socket/Context'
interface IUserItemProps {
  name: string
  sid: string
}

export const UserItem: React.FunctionComponent<IUserItemProps> = ({
  name,
  sid,
}) => {
  const { socket } = useContext(SocketContext).SocketState

  const onClick = () => {
    socket?.emit('peer_init', { sid })
  }

  return (
    <div>
      <p onClick={onClick}>{name}</p>
    </div>
  )
}
