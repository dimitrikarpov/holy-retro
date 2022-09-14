import { Server as HTTPServer } from 'http'
import { Socket, Server } from 'socket.io'
import { generateName } from './generateName'

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
    const extractNameOnly = (user: TUser): string => user.name

    console.info('Message recieved from  ' + socket.id)

    socket.on(
      'handshake',
      (callback: (users: string[], ownName: string) => void) => {
        const reconnected = this.users.find(({ sid }) => socket.id === sid)
        if (reconnected) {
          callback(this.users.map(extractNameOnly), reconnected.name)
        } else {
          /** Generate a new user */
          const newUser = { sid: socket.id, name: generateName() }
          this.users.push(newUser)

          callback(this.users.map(extractNameOnly), newUser.name)

          /** Send new user to all connected users */
          socket.broadcast.emit('user_connected', newUser.name)
        }
      }
    )

    socket.on('disconnect', () => {
      console.info('Disconnect recieved from ' + socket.id)

      const deletedName = this.users.find(({ sid }) => sid === socket.id)?.name
      this.users = this.users.filter(({ sid }) => sid !== socket.id)

      socket.broadcast.emit('user_disconnected', deletedName)
    })
  }
}
