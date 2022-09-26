import Peer from 'simple-peer'

export {}

declare global {
  interface Window {
    SimplePeer: typeof Peer // whatever type you want to give. (any,number,float etc)
  }
}
