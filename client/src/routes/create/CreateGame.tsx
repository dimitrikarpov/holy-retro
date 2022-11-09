import { useContext, useEffect, useRef, useState } from "react"
import SocketContext from "contexts/socket/SocketContext"
import { useMyName } from "contexts/socket/useMyName"
import { CreateGameFomDto, CreateGameForm } from "./CreateGameForm"
import { CreateGameSummary } from "./CreateGameSummary"
import { emitAndWaitForAnswer } from "utils/emitAndWaitForAnswer"
import { PeersContext } from "contexts/peers/PeersContext"
// import { Recorder } from "routes/player/Recorder"
import { Video } from "./Video"

export const CreateGame: React.FunctionComponent = () => {
  const {
    SocketState: { socket },
  } = useContext(SocketContext)
  const { peers, isAllConnected, setMyRole } = useContext(PeersContext)

  const name = useMyName()

  const [rom, setRom] = useState<string>()
  const [player, setPlayer] = useState<string>()
  const { current: roles } = useRef({ manager: "", player: "" })

  const [isStreamReady, setIsStreamReady] = useState<boolean>(false)
  const [stream, setStream] = useState<MediaStream>()

  useEffect(() => {
    socket?.emit("room:create", name)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isAllConnected) return

    /** associate roles with local peers */
    setMyRole("manager")
    peers.find(({ sid }) => sid === roles.player)!.role = "player"

    /** subscribe peers */
    peers
      .find(({ role }) => role === "player")
      ?.instance.on("data", (chunk: Uint8Array) => {
        const message = parsePeerMessage(chunk)

        if (message.type === "peer:player-loaded") {
          // send rom

          const romMessage = createPeerMessage("peer:set-rom", {
            rom,
          })

          console.log({ romMessage })

          peers.find(({ role }) => role === "player")?.instance.send(romMessage)
        }
      })

    /** subscribe for stream */

    peers
      .find(({ role }) => role === "player")
      ?.instance.on("stream", (stream) => {
        console.log("go STREAM")

        // // got remote video stream, now let's show it in a video tag
        // var video = document.querySelector('video') as HTMLVideoElement

        // console.log({ stream })

        // video.srcObject = stream
        // video.play()

        // setIsStreamReady(true)

        // setStream(stream)
      })

    /** send roles to peers */
    peers.forEach((peer) => {
      peer.instance.send(
        createPeerMessage("peer:update-role", {
          sid: socket!.id,
          role: "manager",
        })
      )

      peer.instance.send(
        createPeerMessage("peer:update-role", {
          sid: roles.player,
          role: "player",
        })
      )
    })

    // peers[0].instance.send(createPeerMessage('peer:set-rom', { rom: 'foo' }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllConnected])

  const onSubmit = async ({ rom, player }: CreateGameFomDto) => {
    roles.manager = String(socket?.id)
    roles.player = String(player)

    setRom(rom)
    setPlayer(player)

    await emitAndWaitForAnswer(
      socket!,
      "room:joinded",
      "room:invite",
      player,
      name
    )

    socket!.emit("peer:prepare", name) // peer prepare for room
  }

  /*
onMount: создаём комнату
---
выбираем в визарде игрока и наблюдателя (?)
добавляем всех в комнату
отправляем всем peer:connect
все подключены
отправляем роли через peer:set-role
*/

  const shouldDisplayForm = !rom && !player

  return (
    <>
      <h1>create new game</h1>

      {shouldDisplayForm ? (
        <CreateGameForm onSubmit={onSubmit} />
      ) : (
        <CreateGameSummary manager={roles.manager} player={roles.player} />
      )}

      {stream && <Video stream={stream} />}

      {/* {isStreamReady && capturedStream && <Recorder stream={capturedStream} />} */}
    </>
  )
}

export const createPeerMessage = (type: string, payload?: any): string => {
  return JSON.stringify({ type, payload })
}

export const parsePeerMessage = (chunk: Uint8Array) => {
  return JSON.parse(chunk.toString())
}
