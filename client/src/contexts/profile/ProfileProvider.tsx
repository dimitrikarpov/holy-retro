import { FunctionComponent } from 'react'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import { ProfileContext } from './profileContext'

type ProfileProviderProps = {
  children?: React.ReactNode | undefined
}

export const ProfileProvider: FunctionComponent<ProfileProviderProps> = ({
  children,
}) => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
    separator: '-',
  })

  return (
    <ProfileContext.Provider value={{ name }}>
      {children}
    </ProfileContext.Provider>
  )
}
