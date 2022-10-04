import { Server, Socket } from 'socket.io'
import { TUser } from '../types/common'
import { generateUserName } from '../utils/generateUserName'

let users: TUser[] = []

export default function (io: Server, socket: Socket) {
  const handshake = (callback: (users: TUser[]) => void) => {
    const reconnected = users.find(({ sid }) => socket.id === sid)

    if (!reconnected) {
      const newUser = {
        sid: socket.id,
        name: generateUserName(),
        isBusy: false,
      }

      users.push(newUser)

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
  // socket.on('user:connect')
  // socket.on('user:set-busy')
  // socket.on('user:set-not-busy')
}
