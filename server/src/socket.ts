import http from 'http'
import { Server, Socket } from 'socket.io'
import userHanlder from './handlers/userHanlder'
import peerHandler from './handlers/peerHandler'
import roomHandler from './handlers/roomHandler'

export default (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  const onConnection = (socket: Socket) => {
    userHanlder(io, socket)
    peerHandler(io, socket)
    roomHandler(io, socket)
  }

  io.on('connection', onConnection)
}
