import { createContext, Dispatch } from 'react'
import { Socket } from 'socket.io-client'

export type TUser = {
  sid: string
  name: string
  isBusy: boolean
}

interface ISocketContextState {
  socket: Socket | undefined
  users: TUser[]
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  users: [],
}

type TSocketContextAction =
  | {
      type: 'socket:set'
      payload: Socket
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

export const SocketReducer = (
  state: ISocketContextState,
  action: TSocketContextAction
) => {
  switch (action.type) {
    case 'socket:set':
      return { ...state, socket: action.payload }

    case 'users:update':
      return { ...state, users: action.payload }

    case 'users:add':
      return { ...state, users: [...state.users, action.payload] }

    case 'users:remove':
      return {
        ...state,
        users: state.users.filter(({ sid }) => sid !== action.payload),
      }

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
