import SocketContext from 'contexts/socket/SocketContext'
import React, { useContext, useState } from 'react'
import { convertFileToBase64 } from 'utils/covertFileToBase64'

export type CreateGameFomDto = {
  rom: string
  player: string
}

type CreateGameFormProps = {
  onSubmit: (data: CreateGameFomDto) => void
}

export const CreateGameForm: React.FunctionComponent<CreateGameFormProps> = ({
  onSubmit,
}) => {
  const {
    SocketState: { socket, users },
  } = useContext(SocketContext)

  const [rom, setRom] = useState<File>()
  const [player, setPlayer] = useState<string>()

  const uploadRom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    setRom(fileList[0])
  }

  const selecPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlayer(e.target.value)
  }

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!rom || !player) return

    const romAsBase64 = await convertFileToBase64(rom)

    // console.log({ rom })

    onSubmit({ rom: romAsBase64, player })
  }

  const availableUsers = users
    .filter(({ isBusy }) => !isBusy)
    .filter(({ sid }) => sid !== socket?.id)

  return (
    <form onSubmit={submit}>
      <input type="file" onChange={uploadRom} />

      <select onChange={selecPlayer}>
        <option value="">--- select a player ---</option>
        {availableUsers.map(({ sid, name }) => (
          <option value={sid} key={sid}>
            {name}
          </option>
        ))}
      </select>

      <button type="submit">create game</button>
    </form>
  )
}
