import { FunctionComponent, useContext } from 'react'
import SocketContext from 'contexts/socket/SocketContext'
import { emitAndWaitForAnswer } from 'utils/emitAndWaitForAnswer'

interface IUserItemProps {
  name: string
  sid: string
}

export const UserItem: FunctionComponent<IUserItemProps> = ({ name, sid }) => {
  const socket = useContext(SocketContext).SocketState!.socket
  // const { room } = useContext(PeersContext)

  const onClick = async () => {
    // socket?.emit('room:invite', sid, room)
    await emitAndWaitForAnswer(
      socket!,
      'room:joinded',
      'room:invite',
      sid
      // room
    )

    socket?.emit('role:set', sid, 'player')

    socket?.emit('peer:prepare') // peer prepare for room
  }

  return (
    <div>
      <p onClick={onClick}>{name}</p>
    </div>
  )
}
