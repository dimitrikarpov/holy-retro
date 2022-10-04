import { Server, Socket } from 'socket.io'

export default function (io: Server, socket: Socket) {
  const create = (roomName: string) => {
    console.log('room:create', roomName)

    socket.join(roomName)
  }

  const join = (name: string) => {
    console.log('room:join', name, socket.id)

    socket.join(name)

    socket.broadcast.emit('room:joinded', socket.id)

    socket
      .in(name)
      .allSockets()
      .then((allSockets) => {
        console.log({ allSockets: [...allSockets] })
      })
  }

  const invite = (sid: string, roomName: string) => {
    console.log('room:invite', sid, roomName)

    io.to(sid).emit('room:invite', roomName)
  }

  socket.on('room:create', create)
  socket.on('room:invite', invite)
  socket.on('room:join', join)
}
