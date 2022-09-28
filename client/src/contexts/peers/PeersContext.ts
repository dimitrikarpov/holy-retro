import { createContext } from 'react'
import Peer from 'simple-peer'

export type TPeer = { name?: string; instance: Peer.Instance }

type TPeersContext = {
  peers: TPeer[]
  addPeer: (instance: Peer.Instance) => void
  setPeerName: (name: string, id: string) => void
}

export const PeersContext = createContext<TPeersContext>({
  peers: [],
  addPeer: () => {},
  setPeerName: (name, id) => {},
})
