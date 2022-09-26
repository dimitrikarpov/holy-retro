import { Server, Socket } from 'socket.io'

export default function (io: Server) {
  const peerPrepare = function (this: Socket) {
    const socket = this

    console.log('got PREPARE message', socket.id)

    socket.broadcast.emit('peer:prepare', { sid: socket.id })
  }

  const peerInit = function (this: Socket, { sid }: { sid: string }) {
    const socket = this

    console.log('got INIT message')

    io.to(sid).emit('peer:init', { sid: socket.id })
  }

  const peerSignal = function (
    this: Socket,
    { data, sid }: { data: any; sid: string }
  ) {
    const socket = this
    console.log('got SIGNAL message', sid)

    io.to(sid).emit('peer:signal', { data, sid: socket.id })
  }

  return { peerPrepare, peerInit, peerSignal }
}
