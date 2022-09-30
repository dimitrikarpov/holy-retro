import { PeersContext } from 'contexts/peers/PeersContext'
import { ProfileContext } from 'contexts/profile/profileContext'
import SocketContext from 'contexts/socket/SocketContext'
import { useContext } from 'react'

interface ISocketInfoProps {}

export const SocketInfo: React.FunctionComponent<ISocketInfoProps> = () => {
  const { socket, users } = useContext(SocketContext).SocketState
  const { name, role } = useContext(ProfileContext)
  const { room } = useContext(PeersContext)

  return (
    <div className="socket-info">
      <p>
        name: <strong>{name}</strong>
      </p>

      <p>
        sid: <strong>{socket?.id}</strong>
      </p>

      <p>
        room: <strong>{room}</strong>
      </p>

      <p>
        role: <strong>{role}</strong>
      </p>

      <p>
        Users count: <strong>{users.length}</strong>
      </p>
    </div>
  )
}
