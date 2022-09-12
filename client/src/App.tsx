import { useContext } from 'react'
import SocketContext from './contexts/Socket/Context'

export interface IApplicationProps {}

const App: React.FunctionComponent<IApplicationProps> = () => {
  const { socket, users, uid } = useContext(SocketContext).SocketState

  return (
    <div>
      <h2>Socket IO information</h2>
      <p>
        User ID: <strong>{uid}</strong>
      </p>
      <p>
        Users online: <strong>{users.length}</strong>
      </p>
      <p>
        Socket ID: <strong>{socket?.id}</strong>
      </p>
    </div>
  )
}

export default App
