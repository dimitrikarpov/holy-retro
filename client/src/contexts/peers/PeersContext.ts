import { createContext } from 'react'
import Peer from 'simple-peer'

export type TRole = 'none' | 'player' | 'manager'

export type TPeer = {
  sid: string
  instance: Peer.Instance
  role?: TRole
}

type TPeersContext = {
  peers: TPeer[]
  isAllConnected?: boolean
  myRole: TRole
  setMyRole: React.Dispatch<React.SetStateAction<TRole>>
}

export const PeersContext = createContext<TPeersContext>({
  peers: [],
  isAllConnected: false,
  myRole: 'none',
  setMyRole: () => {},
})
