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

      /*
        // TODO: move this to room connect logic
        */
      /** emit to all users (except owner) which are already in this room to prepare peer connection */
      // const data = {
      //   connUserSocketId: socket.id, // maybe offer socket id of just socketId|sid
      // }
      // socket.broadcast.emit('conn-prepare', data) // signal-offer, signal-prepare
    })

    socket.on('disconnect', () => {
      console.info('Disconnect recieved from ' + socket.id)

      this.users = this.users.filter(({ sid }) => sid !== socket.id)

      socket.broadcast.emit('user_disconnected', socket.id)
    })

    // ************************************************************** //

    socket.on('peer:prepare-player', ({ playerSocketId }) => {
      console.log('ON PLAYER PREPARE', playerSocketId)

      // socket.id - manager socket

      this.io
        .to(playerSocketId)
        .emit('peer:prepare-player', { managerSocketId: socket.id })
    })

    socket.on('peer:prepare-manager', ({ managerSocketId }) => {
      console.log('ON MANAGER PREPARE', managerSocketId)

      // socket.id - player socket

      this.io
        .to(managerSocketId)
        .emit('peer:prepare-manager', { playerSocketId: socket.id })
    })

    socket.on('peer:signal-player', ({ data, sid }) => {
      console.log('ON SIGNAL PLAYER', sid)

      this.io.to(sid).emit('peer:signal-player', data)
    })

    // ************************************************************** //

    socket.on('conn-signal', (data) => {
      const { connUserSocketId, signal } = data

      const signalingData = {
        signal,
        connUserSocketId: socket.id,
      }

      this.io.to(connUserSocketId).emit('conn-signal', signalingData)
    })

    socket.on('conn-init', (data) => {
      const { connUserSocketId } = data

      const initData = {
        connUserSocketId: socket.id,
      }

      this.io.to(connUserSocketId).emit('conn-init', initData)
    })
  }
}

// peer:player-prepare
// peer:manager-prepare
// peer:signal-player
