import { createContext } from 'react'
import Peer from 'simple-peer'

export type TPeer = {
  sid: string
  instance: Peer.Instance
  name?: string
  role?: string
  isAllConnected?: boolean
}

type TPeersContext = {
  peers: TPeer[]
  room?: string
  setRoom: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const PeersContext = createContext<TPeersContext>({
  peers: [],
  room: '',
  setRoom: () => {},
})
