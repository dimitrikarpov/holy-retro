import { Server, Socket } from 'socket.io'

type TRooms = Record<string, string[]>

/** Master list of all created rooms */
let rooms: TRooms = {}

export default function (io: Server, socket: Socket) {
  const create = (name: string) => {
    console.log('room:create', name)

    rooms[name] = [socket.id]

    socket.join(name)
  }

  const join = (name: string) => {
    console.log('room:join', name, socket.id)

    socket.join(name)
  }

  const addParticipant = (sid: string, roomName: string) => {
    console.log('room:add-participant', sid)

    io.to(sid).emit('room:add-participant', roomName)
  }

  socket.on('room:create', create)
  socket.on('room:add-participant', addParticipant)
  socket.on('room:join', join)
}
