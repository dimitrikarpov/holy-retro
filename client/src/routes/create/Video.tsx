import { useEffect, useRef } from "react"

type VideoProps = {
  stream: MediaStream
}

export const Video: React.FunctionComponent<VideoProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current!.srcObject = stream
    videoRef.current!.play()
  }, [])

  return <video ref={videoRef} width="800" height="600"></video>
}
