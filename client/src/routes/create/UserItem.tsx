import { PeersContext } from 'contexts/peers/PeersContext'
import SocketContext from 'contexts/socket/SocketContext'
import { FunctionComponent, useContext } from 'react'

interface IUserItemProps {
  name: string
  sid: string
}

export const UserItem: FunctionComponent<IUserItemProps> = ({ name, sid }) => {
  const socket = useContext(SocketContext).SocketState!.socket
  const { room } = useContext(PeersContext)

  const onClick = () => {
    socket?.emit('room:add-participant', sid, room)

    socket?.emit('role:set', sid, 'player')
  }

  return (
    <div>
      <p onClick={onClick}>{name}</p>
    </div>
  )
}
