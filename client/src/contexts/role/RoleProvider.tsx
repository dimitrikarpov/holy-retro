import React, { FunctionComponent } from 'react'
import { useState } from 'react'
import { RoleContext, TRole } from './RoleContext'

type RoleProviderProps = {
  children?: React.ReactNode | undefined
}

export const RoleProvider: FunctionComponent<RoleProviderProps> = ({
  children,
}) => {
  const [role, setRole] = useState<TRole>('none')

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}
