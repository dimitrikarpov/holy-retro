import { FunctionComponent, useRef, useState } from 'react'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import { ProfileContext, TRole } from './profileContext'

type ProfileProviderProps = {
  children?: React.ReactNode | undefined
}

export const ProfileProvider: FunctionComponent<ProfileProviderProps> = ({
  children,
}) => {
  const { current: name } = useRef(
    uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
      separator: '-',
    })
  )

  const [role, setRole] = useState<TRole>('none')

  console.log('rendered??', name)

  return (
    <ProfileContext.Provider value={{ name, role, setRole }}>
      {children}
    </ProfileContext.Provider>
  )
}
