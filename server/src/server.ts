import http from "http"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import socket from "./socket"

dotenv.config()

const application = express()
application.use(cors)

const httpServer = http.createServer(application)

socket(httpServer)

console.log("-----", process.env.PORT, "----", process.env.FOO)

httpServer.listen(process.env.PORT || 1337, () =>
  console.info(`Server is running`)
)
