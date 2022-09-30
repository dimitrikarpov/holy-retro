import { useContext } from 'react'
import { ProfileContext } from 'contexts/profile/profileContext'
import { useNavigate } from 'react-router-dom'
import SocketContext from 'contexts/socket/SocketContext'
import { PeersContext } from 'contexts/peers/PeersContext'

export const Home = () => {
  const {
    SocketState: { socket },
  } = useContext(SocketContext)
  const { name, setRole } = useContext(ProfileContext)
  const { setRoom } = useContext(PeersContext)
  const navigate = useNavigate()

  const onCreate = () => {
    const roomName = `${name}-room`

    socket?.emit('room:create', roomName)
    setRoom(roomName)
    setRole('manager')

    navigate('/create')
  }

  return (
    <div className="greeting-container">
      <div className="greeting">
        <h1>Hello, {name} </h1>

        <p>You can</p>

        <button onClick={onCreate}>Create a game</button>

        <p>or wait until someone create a game for You</p>
      </div>
    </div>
  )
}
