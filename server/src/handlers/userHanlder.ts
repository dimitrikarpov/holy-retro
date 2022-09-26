import { Server, Socket } from 'socket.io'
import { TUser } from '../types/common'
import { generateName } from '../utils/generateName'

/** Master list of all connected users */
let users: TUser[] = []

export default function (io: Server) {
  const handshake = function (
    this: Socket,
    callback: (users: TUser[]) => void
  ) {
    const socket = this

    const reconnected = users.find(({ sid }) => socket.id === sid)

    if (!reconnected) {
      /** Generate a new user */
      const newUser = { sid: socket.id, name: generateName() }
      users.push(newUser)

      /** Send new user to all connected users */
      socket.broadcast.emit('user_connected', newUser)
    }

    callback(users)
  }

  const disconnect = function (this: Socket) {
    const socket = this

    console.info('Disconnect recieved from ' + socket.id)

    users = users.filter(({ sid }) => sid !== socket.id)

    socket.broadcast.emit('user_disconnected', socket.id)
  }

  return { handshake, disconnect }
}
