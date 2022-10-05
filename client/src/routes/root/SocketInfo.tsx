import { PeersContext } from 'contexts/peers/PeersContext'
import SocketContext from 'contexts/socket/SocketContext'
import { useMyName } from 'contexts/socket/useMyName'
import { useContext } from 'react'

interface ISocketInfoProps {}

export const SocketInfo: React.FunctionComponent<ISocketInfoProps> = () => {
  const { socket, users } = useContext(SocketContext).SocketState
  const { peers, myRole } = useContext(PeersContext)

  const name = useMyName()

  const peersConnected = JSON.stringify(
    peers.map(({ sid, role }) => ({ sid, role }))
  )

  return (
    <div className="socket-info">
      <p>
        name: <strong>{name}</strong>
      </p>

      <p>
        sid: <strong>{socket?.id}</strong>
      </p>

      <p>
        users online: <strong>{users.length}</strong>
      </p>

      <p>
        role: <strong>{myRole}</strong>
      </p>

      <span>
        peers: <pre>{peersConnected}</pre>
      </span>
    </div>
  )
}
