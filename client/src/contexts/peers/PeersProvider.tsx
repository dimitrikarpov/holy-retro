import { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import SocketContext from 'contexts/socket/SocketContext'
import { PeersContext, TPeer } from './PeersContext'
import { getConfiguration } from './getConfiguration'

type PeersProviderProps = {
  children?: React.ReactNode | undefined
}

export const PeersProvider: React.FunctionComponent<PeersProviderProps> = ({
  children,
}) => {
  const socket = useContext(SocketContext).SocketState!.socket!

  let peers: TPeer[] = []

  const [isAllConnected, setIsAllConnected] = useState<boolean>(false)

  const onPeerConnect = (sid: string) => {
    const isEveryPeerConnected = peers.every(({ instance }) => {
      return instance.connected
    })

    if (isEveryPeerConnected) {
      setIsAllConnected(true)
    }
  }

  useEffect(() => {
    subscribeSocket(peers, socket, onPeerConnect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PeersContext.Provider value={{ peers, isAllConnected, setIsAllConnected }}>
      {children}
    </PeersContext.Provider>
  )
}

const subscribeSocket = (
  peers: TPeer[],
  socket: Socket,
  onPeerConnect: (sid: string) => void
  // setRoom: React.Dispatch<React.SetStateAction<string | undefined>>
  // setRole: React.Dispatch<React.SetStateAction<TRole>>,
  // navigate: NavigateFunction
) => {
  socket.on('room:invite', (roomName: string) => {
    console.log('room:add-invite', roomName)

    socket.emit('room:join', roomName)
    // setRoom(roomName)
  })

  // socket.on('role:set', (role: TRole) => {
  //   console.log('set:role', role)

  //   setRole(role)
  //   navigate('/player')
  // })

  /** Peer events */
  socket.on('peer:prepare', ({ sid }: { sid: string }) => {
    console.log('[peer:prepare]')

    peers.push({
      sid,
      instance: preparePeer(sid, false, socket as Socket, onPeerConnect),
    })

    socket.emit('peer:init', { sid })
  })

  socket!.on('peer:init', ({ sid }: { sid: string }) => {
    console.log('[peer:init]')

    peers.push({
      sid,
      instance: preparePeer(sid, true, socket as Socket, onPeerConnect),
    })
  })

  socket!.on('peer:signal', ({ data, sid }: { data: any; sid: string }) => {
    console.log('[peer:signal]')

    const peerFound = peers.find((peer) => sid === peer.sid)

    peerFound!.instance.signal(data)

    console.log({ peers })
  })
}

const preparePeer = (
  sid: string,
  initiator: boolean,
  socket: Socket,
  onPeerConnect: (sid: string) => void
) => {
  const configuration = getConfiguration()

  const SimplePeerGlobal = window.SimplePeer

  const peer = new SimplePeerGlobal({
    config: configuration,
    initiator,
  })

  peer.on('signal', (data) => {
    socket.emit('peer:signal', { data, sid })
  })

  peer.on('connect', () => {
    console.log('connected with', sid)
    onPeerConnect(sid)
  })

  peer.on('data', (chunk) => {
    console.log('DATA:', chunk)
  })

  return peer
}
