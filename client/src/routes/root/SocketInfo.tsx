import SocketContext from 'contexts/socket/SocketContext'
import { useMyName } from 'contexts/socket/useMyName'
import { useContext } from 'react'

interface ISocketInfoProps {}

export const SocketInfo: React.FunctionComponent<ISocketInfoProps> = () => {
  const { socket, users } = useContext(SocketContext).SocketState

  const name = useMyName()

  return (
    <div className="socket-info">
      <p>
        name: <strong>{name}</strong>
      </p>

      <p>
        sid: <strong>{socket?.id}</strong>
      </p>

      <p>
        Users count: <strong>{users.length}</strong>
      </p>
    </div>
  )
}
