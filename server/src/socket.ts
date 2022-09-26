import { Server as HTTPServer } from 'http'
import { Socket, Server } from 'socket.io'
import { generateName } from './utils/generateName'

type TUser = {
  sid: string
  name: string
}

export class ServerSocket {
  public static instance: ServerSocket
  public io: Server

  /** Master list of all connected users */
  public users: TUser[] = []

  constructor(server: HTTPServer) {
    ServerSocket.instance = this
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*',
      },
    })

    this.io.on('connect', this.StartListeners)

    console.info('Socket IO started')
  }

  StartListeners = (socket: Socket) => {
    console.info('Message recieved from  ' + socket.id)

    socket.on('handshake', (callback: (users: TUser[]) => void) => {
      const reconnected = this.users.find(({ sid }) => socket.id === sid)

      if (!reconnected) {
        /** Generate a new user */
        const newUser = { sid: socket.id, name: generateName() }
        this.users.push(newUser)

        /** Send new user to all connected users */
        socket.broadcast.emit('user_connected', newUser)
      }

      callback(this.users)
    })

    socket.on('disconnect', () => {
      console.info('Disconnect recieved from ' + socket.id)

      this.users = this.users.filter(({ sid }) => sid !== socket.id)

      socket.broadcast.emit('user_disconnected', socket.id)
    })

    socket.on('peer:prepare', () => {
      console.log('got PREPARE message', socket.id)

      socket.broadcast.emit('peer:prepare', { sid: socket.id })
    })

    socket.on('peer:init', ({ sid }) => {
      console.log('got INIT message')

      this.io.to(sid).emit('peer:init', { sid: socket.id })
    })

    socket.on('peer:signal', ({ data, sid }) => {
      console.log('got SIGNAL message', sid)

      this.io.to(sid).emit('peer:signal', { data, sid: socket.id })
    })
  }
}
