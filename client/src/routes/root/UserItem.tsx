interface IUserItemProps {
  name: string
  sid: string
}

export const UserItem: React.FunctionComponent<IUserItemProps> = ({
  name,
  sid,
}) => {
  return (
    <div>
      <p>{name}</p>
    </div>
  )
}
