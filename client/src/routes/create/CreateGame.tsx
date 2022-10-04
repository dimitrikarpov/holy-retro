import { useContext, useEffect, useRef, useState } from 'react'
import SocketContext from 'contexts/socket/SocketContext'
import { useMyName } from 'contexts/socket/useMyName'
import { CreateGameFomDto, CreateGameForm } from './CreateGameForm'
import { CreateGameSummary } from './CreateGameSummary'
import { emitAndWaitForAnswer } from 'utils/emitAndWaitForAnswer'
import { PeersContext } from 'contexts/peers/PeersContext'

export const CreateGame: React.FunctionComponent = () => {
  const {
    SocketState: { socket },
  } = useContext(SocketContext)
  const { peers, isAllConnected, setMyRole } = useContext(PeersContext)

  const name = useMyName()

  const [rom, setRom] = useState<File>()
  const [player, setPlayer] = useState<string>()
  const { current: roles } = useRef({ manager: '', player: '' })

  useEffect(() => {
    socket?.emit('room:create', name)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isAllConnected) return

    console.log('HOORAY')

    /** set own peers roles */

    setMyRole('manager')

    peers.find(({ sid }) => sid === roles.player)!.role = 'player'

    console.log({ peers, roles })

    /** emit peers roles */
    peers.forEach((peer) => {
      peer.instance.send('foo')
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllConnected])

  const onSubmit = async ({ rom, player }: CreateGameFomDto) => {
    roles.manager = String(socket?.id)
    roles.player = String(player)

    setRom(rom)
    setPlayer(player)

    await emitAndWaitForAnswer(
      socket!,
      'room:joinded',
      'room:invite',
      player,
      name
    )

    socket!.emit('peer:prepare', name) // peer prepare for room
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
        <CreateGameSummary
          manager={roles.manager}
          player={roles.player}
          rom={rom}
        />
      )}
    </>
  )
}
