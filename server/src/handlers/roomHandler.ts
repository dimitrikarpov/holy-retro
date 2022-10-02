import { Server, Socket } from 'socket.io'

type TRooms = Record<string, string[]>

/** Master list of all created rooms */
export let rooms: TRooms = {}

export default function (io: Server, socket: Socket) {
  const create = (name: string) => {
    console.log('room:create', name)

    rooms[name] = [socket.id]

    socket.join(name)
  }

  const join = (name: string) => {
    console.log('room:join', name, socket.id)

    rooms[name].push(socket.id)

    socket.join(name)

    socket.broadcast.emit('room:joinded', socket.id)

    // socket
    //   .in(name)
    //   .allSockets()
    //   .then((allSockets) => {
    //     console.log({ allSockets: [...allSockets] })
    //   })
  }

  const invite = (sid: string, roomName: string) => {
    console.log('room:invite', sid)

    io.to(sid).emit('room:invite', roomName)
  }

  socket.on('room:create', create)
  socket.on('room:invite', invite)
  socket.on('room:join', join)
}
