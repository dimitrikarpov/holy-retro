import { createContext, Dispatch } from 'react'
import { Socket } from 'socket.io-client'
import Peer from 'simple-peer'

export type TUser = {
  sid: string
  name: string
}

type TRole = 'none' | 'manager' | 'player'

interface ISocketContextState {
  socket: Socket | undefined
  peer: Peer.Instance | undefined
  users: TUser[]
  role: TRole
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  peer: undefined,
  users: [],
  role: 'none',
}

type TSocketContextAction =
  | {
      type: 'socket:set'
      payload: Socket
    }
  | {
      type: 'peer:set'
      payload: Peer.Instance
    }
  | {
      type: 'users:update'
      payload: TUser[]
    }
  | {
      type: 'users:add'
      payload: TUser
    }
  | {
      type: 'users:remove'
      payload: string
    }
  | {
      type: 'role:set'
      payload: TRole
    }

export const SocketReducer = (
  state: ISocketContextState,
  action: TSocketContextAction
) => {
  console.log(
    `Message recieved - Action: [${action.type}] - Payload: [${action.payload}]`
  )

  switch (action.type) {
    case 'socket:set':
      return { ...state, socket: action.payload }

    case 'peer:set':
      return { ...state, peer: action.payload }

    case 'users:update':
      return { ...state, users: action.payload }

    case 'users:add':
      return { ...state, users: [...state.users, action.payload] }

    case 'users:remove':
      return {
        ...state,
        users: state.users.filter(({ sid }) => sid !== action.payload),
      }

    case 'role:set':
      return { ...state, role: action.payload }

    default:
      return { ...state }
  }
}

interface ISocketContextProps {
  SocketState: ISocketContextState
  SocketDispatch: Dispatch<TSocketContextAction>
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {},
})

export default SocketContext
