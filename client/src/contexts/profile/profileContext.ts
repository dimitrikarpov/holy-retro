import { createContext } from 'react'

export type TRole = 'none' | 'player' | 'manager'

type TProfileContext = {
  name: string
  role: TRole
  setRole: React.Dispatch<React.SetStateAction<TRole>>
}

export const ProfileContext = createContext<TProfileContext>({
  name: '',
  role: 'none',
  setRole: () => {},
})
