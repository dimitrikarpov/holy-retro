import { useEffect, useRef } from 'react'

type RecorderProps = {
  stream: MediaStream
}

export const Recorder: React.FunctionComponent<RecorderProps> = ({
  stream,
}) => {
  let { current: chunks } = useRef<Blob[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // const canvasEl = document.getElementById('canvas') as HTMLCanvasElement
    // const stream = canvasEl.captureStream(60)

    // const stream = window.RA.context.createMediaStreamDestination()
    //   .stream as MediaStream

    // window.RA.context.createMediaStreamDestination()

    // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log('----------- Recorder: -----------', stream)
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (evt) => {
      // Push each chunk (blobs) in an array
      console.log('----------- Recorder: -----------', evt.data)
      chunks.push(evt.data)
    }

    mediaRecorder.start(1000)
    // })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onStopClick = () => {
    // const type = 'audio/ogg; codecs=opus'

    const blob = new Blob(chunks)
    chunks = []

    const audioURL = URL.createObjectURL(blob)
    videoRef.current!.src = audioURL

    console.log('recorder stopped')
  }

  return (
    <div style={{ border: '1px solid', padding: '1rem' }}>
      <video ref={videoRef}></video>

      <button onClick={onStopClick}></button>
    </div>
  )
}
