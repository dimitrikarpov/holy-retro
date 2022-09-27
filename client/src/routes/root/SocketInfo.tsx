import SocketContext from 'contexts/socket/SocketContext'
import { useContext } from 'react'

interface ISocketInfoProps {}

export const SocketInfo: React.FunctionComponent<ISocketInfoProps> = () => {
  const { socket, users } = useContext(SocketContext).SocketState

  return (
    <div>
      <h2>Socket IO information</h2>
      <p>
        Socket ID: <strong>{socket?.id}</strong>
      </p>
      <p>
        Users count: <strong>{users.length}</strong>
      </p>
    </div>
  )
}
