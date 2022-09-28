import Peer from 'simple-peer'
import { PeersContext, TPeer } from './PeersContext'

type PeersProviderProps = {
  children?: React.ReactNode | undefined
}

export const PeersProvider: React.FunctionComponent<PeersProviderProps> = ({
  children,
}) => {
  let peers: TPeer[] = []

  const addPeer = (instance: Peer.Instance) => {
    peers.push({ instance })
  }

  const setPeerName = (name: string, id: string) => {
    // const peerFound =
  }

  return (
    <PeersContext.Provider
      value={{
        peers,
        addPeer,
        setPeerName,
      }}
    >
      {children}
    </PeersContext.Provider>
  )
}
