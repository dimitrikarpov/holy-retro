import { createContext } from 'react'

type TProfileContext = {
  name: string
}

export const ProfileContext = createContext<TProfileContext>({
  name: '',
})
