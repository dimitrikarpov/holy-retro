import { PeersContext } from 'contexts/peers/PeersContext'
import SocketContext from 'contexts/socket/SocketContext'
import { FunctionComponent, useContext } from 'react'
import { Socket } from 'socket.io-client'

interface IUserItemProps {
  name: string
  sid: string
}

export const UserItem: FunctionComponent<IUserItemProps> = ({ name, sid }) => {
  const socket = useContext(SocketContext).SocketState!.socket
  const { room } = useContext(PeersContext)

  const onClick = async () => {
    // socket?.emit('room:invite', sid, room)
    await emitAndWaitForAnswer(
      socket!,
      'room:joinded',
      'room:invite',
      sid,
      room
    )

    socket?.emit('role:set', sid, 'player')

    socket?.emit('peer:prepare', room)
  }

  return (
    <div>
      <p onClick={onClick}>{name}</p>
    </div>
  )
}

const emitAndWaitForAnswer = (
  socket: Socket,
  waitingEventName: string,
  emittedEventName: string,
  ...args: any[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    socket.emit(emittedEventName, ...args)

    socket.on(waitingEventName, (result: any) => {
      console.log('event fired??', result)

      socket.off(waitingEventName)

      resolve(result)
    })

    setTimeout(reject, 2000)
  })
}
