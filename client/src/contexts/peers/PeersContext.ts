import React, { createContext } from 'react'
import Peer from 'simple-peer'

export type TRole = 'none' | 'player' | 'manager'

export type TPeer = {
  sid: string
  instance: Peer.Instance
  name?: string
  role?: TRole
}

type TPeersContext = {
  peers: TPeer[]
  isAllConnected?: boolean
  setIsAllConnected: React.Dispatch<React.SetStateAction<boolean>>
}

export const PeersContext = createContext<TPeersContext>({
  peers: [],
  isAllConnected: false,
  setIsAllConnected: () => {},
})
