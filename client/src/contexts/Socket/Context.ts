import { createContext, Dispatch } from 'react'
import { Socket } from 'socket.io-client'

export type TUser = {
  sid: string
  name: string
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
  console.log(
    `Message recieved - Action: [${action.type}] - Payload: [${action.payload}]`
  )

  switch (action.type) {
    case 'socket:set':
      return { ...state, socket: action.payload as Socket }

    case 'users:update':
      return { ...state, users: action.payload as TUser[] }

    case 'users:add':
      return { ...state, users: [...state.users, action.payload as TUser] }

    case 'users:remove':
      return {
        ...state,
        users: state.users.filter(
          ({ sid }) => sid !== (action.payload as string)
        ),
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
