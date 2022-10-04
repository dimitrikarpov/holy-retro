import { useNavigate } from 'react-router-dom'
import { useMyName } from 'contexts/socket/useMyName'

export const Home = () => {
  const name = useMyName()

  const navigate = useNavigate()

  const onCreate = () => {
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
