import { Server, Socket } from 'socket.io'
import { rooms } from './roomHandler'

export default function (io: Server, socket: Socket) {
  const peerPrepare = (room: string) => {
    console.log('got PREPARE message', socket.id)

    socket.to(room).emit('peer:prepare', { sid: socket.id })

    /*
    second variant  

    rooms[room]
      .filter((sid: string) => socket.id !== sid)
      .forEach((sid) => {
        io.to(sid).emit('peer:prepare', { sid: socket.id })
      })
    */

    /*
      
      third variant

      socket.broadcast.emit('peer:prepare', { sid: socket.id }) //
      */
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
