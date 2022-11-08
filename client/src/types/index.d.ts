import Peer from "simple-peer"

export {}

declare global {
  interface Window {
    SimplePeer: typeof Peer
    Module: any
    FS: any
    RA: any
  }
}
