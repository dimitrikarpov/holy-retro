import { PeersContext } from 'contexts/peers/PeersContext'
import { useContext, useEffect, useState } from 'react'
import { createPeerMessage, parsePeerMessage } from 'routes/create/CreateGame'
import { RetroarchService } from 'services/retroarch/RetroarchService'
import { convertBase64ToArrayBuffer } from 'utils/convertBase64ToArrayBuffer'
import { Recorder } from './Recorder'

export const Player: React.FunctionComponent = () => {
  const { peers } = useContext(PeersContext)

  const [rom, setRom] = useState<any>()
  const [isStreamReady, setIsStreamReady] = useState<boolean>(false)

  useEffect(() => {
    const managerPeer = peers.find(({ role }) => role === 'manager')

    managerPeer?.instance.send(createPeerMessage('peer:player-loaded'))

    peers[0].instance.on('data', (chunk: Uint8Array) => {
      console.log('in player page catched!!', chunk)

      const message = parsePeerMessage(chunk)

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

    // TODO: timeout for fixing 'undefined HEAP8' issue. we need actually know then module is ready
    setTimeout(() => {
      try {
        RetroarchService.run(rom)

        setTimeout(() => {
          const canvasEl = document.getElementById(
            'canvas'
          ) as HTMLCanvasElement
          const videoStream = canvasEl.captureStream(60)
          const audioStream = window.RA.xdest.stream as MediaStream

          const stream = new MediaStream()
          videoStream.getTracks().forEach((track) => stream.addTrack(track))
          audioStream.getTracks().forEach((track) => stream.addTrack(track))

          peers[0].instance.addStream(stream)

          setIsStreamReady(true)
        }, 2000)
      } catch (e) {
        console.log(e)
      }
    }, 3000)
  }, [rom])

  return (
    <>
      <h1>Player page</h1>
      {/* {isStreamReady && <Recorder stream={thing} />} */}
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

/**
 
audioinput: Default id = default
audioinput: Built-in Audio Analog Stereo 
id = a9cc45db6f25575fa7f45fea04b759f671326ef00d2a041354798271d2c4f9eb
     a9cc45db6f25575fa7f45fea04b759f671326ef00d2a041354798271d2c4f9eb
 */
