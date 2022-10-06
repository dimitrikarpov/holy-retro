type CreateGameSummaryProps = {
  manager: string
  player: string
}

export const CreateGameSummary: React.FunctionComponent<
  CreateGameSummaryProps
> = ({ player, manager }) => {
  return (
    <div>
      <p>player: {player}</p>

      <p>manager: {manager}</p>
    </div>
  )
}
