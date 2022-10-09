import { PeersContext } from 'contexts/peers/PeersContext'
import { useContext, useEffect, useState } from 'react'
import { createPeerMessage, parsePeerMessage } from 'routes/create/CreateGame'
import { RetroarchService } from 'services/retroarch/RetroarchService'
import { convertBase64ToArrayBuffer } from 'utils/convertBase64ToArrayBuffer'

let stream: MediaStream

export const Player: React.FunctionComponent = () => {
  const { peers } = useContext(PeersContext)

  const [rom, setRom] = useState<any>()

  useEffect(() => {
    const managerPeer = peers.find(({ role }) => role === 'manager')

    managerPeer?.instance.send(createPeerMessage('peer:player-loaded'))

    peers[0].instance.on('data', (chunk: Uint8Array) => {
      console.log('in player page catched!!', chunk)

      const message = parsePeerMessage(chunk)

      console.log({ message })

      if (message.type === 'peer:set-rom') {
        console.log('peer:set-rom')
        // setRom(message.payload.rom)
        convertBase64ToArrayBuffer(message.payload.rom).then((rom) => {
          setRom(rom)
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const init = async () => {
      RetroarchService.prepareModule()
      await RetroarchService.loadCore(
        `${process.env.PUBLIC_URL}/cores/nestopia_libretro.js`
      )
    }

    init()
  }, [])

  useEffect(() => {
    if (!rom) return

    console.log('ROM HAS SETTLED!!', rom)

    // TODO: timeout for fixing 'undefined HEAP8' issue. we need actually know then module is ready
    setTimeout(() => {
      try {
        RetroarchService.run(rom)

        setTimeout(() => {
          const canvasEl = document.getElementById(
            'canvas'
          ) as HTMLCanvasElement

          stream = canvasEl.captureStream(60)

          const audioStream = window.RA.context.createMediaStreamDestination()
            .stream as MediaStream

          console.log({ stream, audioStream })

          const newStream = new MediaStream()
          stream.getTracks().forEach((track) => newStream.addTrack(track))
          audioStream.getTracks().forEach((track) => newStream.addTrack(track))

          console.log({ stream, audioStream, newStream })

          peers[0].instance.addStream(newStream)

          // RA.context.createMediaStreamDestination().stream type of media stream
        }, 2000)
      } catch (e) {
        console.log(e)
      }
    }, 2000)
  }, [rom])

  return (
    <>
      <h1>Player page</h1>
    </>
  )
}

/*

  const onUpload = (rom) => {
    RetroarchService.run(rom)
  }


*/

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
