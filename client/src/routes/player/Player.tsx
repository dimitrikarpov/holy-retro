import { PeersContext } from "contexts/peers/PeersContext"
import { useContext, useEffect, useState } from "react"
import { createPeerMessage, parsePeerMessage } from "routes/create/CreateGame"
import { convertBase64ToArrayBuffer } from "utils/convertBase64ToArrayBuffer"
import { Emulator } from "./Emulator"

export const Player: React.FunctionComponent = () => {
  const { peers } = useContext(PeersContext)

  const [rom, setRom] = useState<any>()

  useEffect(() => {
    const managerPeer = peers.find(({ role }) => role === "manager")

    managerPeer?.instance.send(createPeerMessage("peer:player-loaded")) // sending message 'player page is ready'

    peers[0].instance.on("data", (chunk: Uint8Array) => {
      // and ready to handle 'set-rom' message
      console.log("in player page catched!!", chunk)

      const message = parsePeerMessage(chunk)

      if (message.type === "peer:set-rom") {
        console.log("peer:set-rom")
        // setRom(message.payload.rom)
        convertBase64ToArrayBuffer(message.payload.rom).then((rom) => {
          setRom(rom)
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEmulatorStarted = (stream: MediaStream) => {
    peers[0].instance.addStream(stream)
  }

  return (
    <>
      <h1>Player page</h1>
      {rom && (
        <Emulator core="nestopia" rom={rom} onStarted={onEmulatorStarted} />
      )}
    </>
  )
}

/*
  player states:
  isRomRecieved,
  isSaveStateRecieved,

  --------------------

  messages to recieve:

  {type: rom, payload: binary data}
  {type: save: paylaod: binary data}
  {type: game:run}
  {type: game:reset}


  messages to send:

  {type: rom:recieved}
  {type: save:recieved}

*/
