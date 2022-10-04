import { Socket } from 'socket.io-client'

export const emitAndWaitForAnswer = (
  socket: Socket,
  waitingEventName: string,
  emittedEventName: string,
  ...args: any[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    socket.emit(emittedEventName, ...args)

    socket.on(waitingEventName, (result: any) => {
      socket.off(waitingEventName)

      resolve(result)
    })

    setTimeout(reject, 5000)
  })
}
