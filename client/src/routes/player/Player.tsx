import { PeersContext } from 'contexts/peers/PeersContext'
import { useContext, useEffect, useState } from 'react'
import { createPeerMessage, parsePeerMessage } from 'routes/create/CreateGame'
import { convertBase64ToArrayBuffer } from 'utils/convertBase64ToArrayBuffer'

export const Player: React.FunctionComponent = () => {
  const { peers } = useContext(PeersContext)

  const [rom, setRom] = useState<ArrayBuffer>()

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
        convertBase64ToArrayBuffer(message.payload.rom).then(
          (rom: ArrayBuffer) => {
            setRom(rom)
          }
        )
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!rom) return

    console.log('ROM HAS SETTLED!!')
  }, [rom])

  return (
    <>
      <h1>Player page</h1>
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
