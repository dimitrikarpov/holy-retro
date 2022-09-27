import { useContext } from 'react'
import SocketContext from 'contexts/Socket/Context'

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
