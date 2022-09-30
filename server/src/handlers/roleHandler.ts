import { Server, Socket } from 'socket.io'

export default function (io: Server, socket: Socket) {
  const set = (sid: string, role: string) => {
    io.to(sid).emit('role:set', role)
  }

  socket.on('role:set', set)
}
