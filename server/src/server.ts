import http from 'http'
import { Server, Socket } from 'socket.io'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import { ServerSocket } from './socket'
import userHanlder from './handlers/userHanlder'
import peerHandler from './handlers/peerHandler'

dotenv.config()

const application = express()
application.use(cors)

const httpServer = http.createServer(application)

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

const { handshake, disconnect } = userHanlder(io)
const { peerPrepare, peerInit, peerSignal } = peerHandler(io)

const onConnection = (socket: Socket) => {
  socket.on('handshake', handshake)
  socket.on('disconnect', disconnect)
  socket.on('peer:prepare', peerPrepare)
  socket.on('peer:init', peerInit)
  socket.on('peer:signal', peerSignal)
}

io.on('connection', onConnection)

httpServer.listen(process.env.PORT || 1337, () =>
  console.info(`Server is running`)
)
