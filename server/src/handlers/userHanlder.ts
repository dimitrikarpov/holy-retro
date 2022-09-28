import { Server, Socket } from 'socket.io'
import { TUser } from '../types/common'

/** Master list of all connected users */
let users: TUser[] = []

export default function (io: Server, socket: Socket) {
  const handshake = (name: string, callback: (users: TUser[]) => void) => {
    const reconnected = users.find(({ sid }) => socket.id === sid)

    if (!reconnected) {
      /** Generate a new user */
      const newUser = { sid: socket.id, name }
      users.push(newUser)

      /** Send new user to all connected users */
      socket.broadcast.emit('user_connected', newUser)
    }

    callback(users)
  }

  const disconnect = () => {
    console.info('Disconnect recieved from ' + socket.id)

    users = users.filter(({ sid }) => sid !== socket.id)

    socket.broadcast.emit('user_disconnected', socket.id)
  }

  socket.on('handshake', handshake)
  socket.on('disconnect', disconnect)
}
