import React, { createContext } from 'react'

export type TRole = 'none' | 'manager' | 'player'

type TRoleContext = {
  role: TRole
  setRole: React.Dispatch<React.SetStateAction<TRole>>
}

export const RoleContext = createContext<TRoleContext>({
  role: 'none',
  setRole: () => {},
})
