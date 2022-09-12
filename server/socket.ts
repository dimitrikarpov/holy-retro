import { Server as HTTPServer } from 'http'
import { Socket, Server } from 'socket.io'
import { v4 } from 'uuid'

type TParticipant = {
  uid: string
  sid: string
}

export class ServerSocket {
  public static instance: ServerSocket
  public io: Server

  /** Master list of all connected users */
  public participants: TParticipant[] = []

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

    socket.on(
      'handshake',
      (callback: (uid: string, users: string[]) => void) => {
        console.info('handshake recieved from ' + socket.id)

        /** Check if this is a reconnection */
        const reconnected = this.participants.some(
          ({ sid }) => socket.id === sid
        )

        if (reconnected) {
          console.log('This user has reconnected')

          const uid = this.getUserIdBySocketId(socket.id)
          const users = this.participants.map(({ uid }) => uid)

          if (uid) {
            console.log('Sending callback to reconnect...')
            callback(uid, users)

            return
          }
        }

        /** Generate a new user */
        const uid = v4()
        this.participants.push({ uid, sid: socket.id })
        const users = this.participants.map(({ uid }) => uid)

        console.log('Sending callback for handshake...')
        callback(uid, users)

        /** Send new user to all connected users */
        this.SendMessage(
          'user_connected',
          this.participants
            .filter((p) => p.sid !== socket.id)
            .map(({ sid }) => sid),
          users
        )
      }
    )

    socket.on('disconnect', () => {
      console.info('Disconnect recieved from ' + socket.id)

      const uid = this.getUserIdBySocketId(socket.id)

      if (uid) {
        this.participants = this.participants.filter((p) => p.uid !== uid)
        const users = this.participants.map(({ uid }) => uid)

        this.SendMessage(
          'user_disconnected',
          this.participants
            .filter((p) => p.sid !== socket.id)
            .map(({ sid }) => sid),
          uid
        )
      }
    })
  }

  getUserIdBySocketId = (sid: string) => {
    return this.participants.find((p) => p.sid === sid)?.uid
  }

  /**
   * Send a message through the socket
   * @param name The name of the event, ex: handshake
   * @param users List of socket id's
   * @param payload any information needed by the user for state updates
   */
  SendMessage = (name: string, users: string[], payload?: Object) => {
    console.log('Emitting event: ' + name + ' to ', users)
    users.forEach((id) =>
      payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
    )
  }
}
