type CreateGameSummaryProps = {
  manager: string
  player: string
  rom: File | undefined
}

export const CreateGameSummary: React.FunctionComponent<
  CreateGameSummaryProps
> = ({ player, manager, rom }) => {
  return (
    <div>
      <p>player: {player}</p>

      <p>manager: {manager}</p>

      <p>rom: {rom?.name}</p>
    </div>
  )
}
