import { createContext } from 'react'
import Peer from 'simple-peer'

export type TPeer = {
  sid: string
  instance: Peer.Instance
  name?: string
  role?: string
}

type TPeersContext = {
  peers: TPeer[]
}

export const PeersContext = createContext<TPeersContext>({
  peers: [],
})
