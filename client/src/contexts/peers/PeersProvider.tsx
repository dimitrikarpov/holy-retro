import { useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import SocketContext from 'contexts/socket/SocketContext'
import { PeersContext, TPeer } from './PeersContext'
import { getConfiguration } from './getConfiguration'
import { ProfileContext, TRole } from 'contexts/profile/profileContext'
import { NavigateFunction, useNavigate } from 'react-router-dom'

type PeersProviderProps = {
  children?: React.ReactNode | undefined
}

export const PeersProvider: React.FunctionComponent<PeersProviderProps> = ({
  children,
}) => {
  const socket = useContext(SocketContext).SocketState!.socket
  const { setRole } = useContext(ProfileContext)
  const navigate = useNavigate()

  const [room, setRoom] = useState<string | undefined>()

  let peers: TPeer[] = []

  useEffect(() => {
    subscribeSocket(peers, socket as Socket, setRoom, setRole, navigate)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PeersContext.Provider value={{ peers, room, setRoom }}>
      {children}
    </PeersContext.Provider>
  )
}

const subscribeSocket = (
  peers: TPeer[],
  socket: Socket,
  setRoom: React.Dispatch<React.SetStateAction<string | undefined>>,
  setRole: React.Dispatch<React.SetStateAction<TRole>>,
  navigate: NavigateFunction
) => {
  socket.on('room:add-participant', (roomName: string) => {
    console.log('room:add-participant', roomName)

    socket.emit('room:join', roomName)
    setRoom(roomName)
  })

  socket.on('role:set', (role: TRole) => {
    console.log('set:role', role)

    setRole(role)
    navigate('/player')
  })

  /** Peer events */
  socket!.on('peer:prepare', ({ sid }: { sid: string }) => {
    console.log('[peer:prepare]')

    peers.push({
      sid: socket!.id,
      instance: preparePeer(sid, false, socket as Socket),
    })

    socket!.emit('peer:init', { sid })
  })

  socket!.on('peer:init', ({ sid }: { sid: string }) => {
    console.log('[peer:init]')

    peers.push({
      sid: socket!.id,
      instance: preparePeer(sid, true, socket as Socket),
    })
  })

  socket!.on('peer:signal', ({ data, sid }: { data: any; sid: string }) => {
    console.log('[peer:signal]')

    const peerFound = peers.find(({ sid }) => sid === socket!.id)

    peerFound!.instance.signal(data)
  })
}

const preparePeer = (sid: string, initiator: boolean, socket: Socket) => {
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
  })

  peer.on('data', (chunk) => {
    console.log('DATA:', chunk)
  })

  return peer
}
