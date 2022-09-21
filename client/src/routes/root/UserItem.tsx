interface IUserItemProps {
  name: string
}

export const UserItem: React.FunctionComponent<IUserItemProps> = ({ name }) => {
  return (
    <div>
      <p>{name}</p>
    </div>
  )
}
