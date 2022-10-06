import { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import SocketContext from 'contexts/socket/SocketContext'
import { PeersContext, TPeer, TRole } from './PeersContext'
import { getConfiguration } from './getConfiguration'
import { useNavigate } from 'react-router-dom'

type PeersProviderProps = {
  children?: React.ReactNode | undefined
}

let peers: TPeer[] = []

export const PeersProvider: React.FunctionComponent<PeersProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate()
  const socket = useContext(SocketContext).SocketState!.socket!

  const [myRole, setMyRole] = useState<TRole>('none')
  const [isAllConnected, setIsAllConnected] = useState<boolean>(false)

  const onPeerConnect = (sid: string) => {
    const isEveryPeerConnected = peers.every(({ instance }) => {
      return instance.connected
    })

    if (isEveryPeerConnected) {
      setIsAllConnected(true)
    }
  }

  const onPeerData = (chunk: Uint8Array) => {
    const message = JSON.parse(chunk.toString())

    console.log('message recieved', message)

    if (message.type === 'peer:update-role') {
      if (message.payload?.sid === socket.id) {
        setMyRole(message.payload.role)

        if (message.payload.role === 'player') {
          navigate('/player')
        }
      } else {
        peers.find(({ sid }) => sid === message.payload.sid)!.role =
          message.payload.role
      }
    }
  }

  useEffect(() => {
    subscribeSocket(peers, socket, onPeerConnect, onPeerData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PeersContext.Provider value={{ peers, isAllConnected, myRole, setMyRole }}>
      {children}
    </PeersContext.Provider>
  )
}

const subscribeSocket = (
  peers: TPeer[],
  socket: Socket,
  onPeerConnect: (sid: string) => void,
  onPeerData: (chunk: Uint8Array) => void
) => {
  /** Room events */
  socket.on('room:invite', (roomName: string) => {
    console.log('room:add-invite', roomName)

    socket.emit('room:join', roomName)
  })

  /** Peer events */
  socket.on('peer:prepare', ({ sid }: { sid: string }) => {
    console.log('[peer:prepare]')

    peers.push({
      sid,
      instance: preparePeer(
        sid,
        false,
        socket as Socket,
        onPeerConnect,
        onPeerData
      ),
    })

    socket.emit('peer:init', { sid })
  })

  socket!.on('peer:init', ({ sid }: { sid: string }) => {
    console.log('[peer:init]')

    peers.push({
      sid,
      instance: preparePeer(
        sid,
        true,
        socket as Socket,
        onPeerConnect,
        onPeerData
      ),
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
  onPeerConnect: (sid: string) => void,
  onPeerData: (chunk: Uint8Array) => void
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

  peer.on('data', (chunk: Uint8Array) => {
    // console.log('DATA:', chunk)
    onPeerData(chunk)
  })

  return peer
}

/*

{type: 'peer:update-role', payload: {sid, role} }

{type: 'emulator:set-rom', payload: {rom: base64}}

{type: 'emulator:init'}

{type: 'emulator:loaded'}

{type: 'stream:start'}

*/
