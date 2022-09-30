import { Server, Socket } from 'socket.io'

export default function (io: Server, socket: Socket) {
  const peerPrepare = () => {
    console.log('got PREPARE message', socket.id)

    socket.broadcast.emit('peer:prepare', { sid: socket.id }) //
  }

  const peerInit = ({ sid }: { sid: string }) => {
    console.log('got INIT message')

    io.to(sid).emit('peer:init', { sid: socket.id })
  }

  const peerSignal = ({ data, sid }: { data: any; sid: string }) => {
    console.log('got SIGNAL message', sid)

    io.to(sid).emit('peer:signal', { data, sid: socket.id })
  }

  socket.on('peer:prepare', peerPrepare)
  socket.on('peer:init', peerInit)
  socket.on('peer:signal', peerSignal)
}
