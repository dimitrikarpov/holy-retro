import React, { createContext } from 'react'
import { Socket } from 'socket.io-client'

export type TUser = {
  sid: string
  name: string
}

export interface ISocketContextState {
  socket: Socket | undefined
  users: TUser[]
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  users: [],
}

export type TSocketContextActions =
  | 'update_socket' // socket:set
  | 'update_users' // users:update
  | 'add_user' // users:add
  | 'remove_user' // users: remove

export type TSocketContextPayload = string | TUser | TUser[] | Socket

export interface ISocketContextActions {
  type: TSocketContextActions
  payload: TSocketContextPayload
}

export const SocketReducer = (
  state: ISocketContextState,
  action: ISocketContextActions
) => {
  console.log(
    `Message recieved - Action: [${action.type}] - Payload: [${action.payload}]`
  )

  switch (action.type) {
    case 'update_socket':
      return { ...state, socket: action.payload as Socket }

    case 'update_users':
      return { ...state, users: action.payload as TUser[] }

    case 'add_user': {
      return { ...state, users: [...state.users, action.payload as TUser] }
    }

    case 'remove_user':
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

export interface ISocketContextProps {
  SocketState: ISocketContextState
  SocketDispatch: React.Dispatch<ISocketContextActions>
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {},
})

export const SocketContextConsumer = SocketContext.Consumer
export const SocketContextProvider = SocketContext.Provider

export default SocketContext
