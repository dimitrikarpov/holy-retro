import { createRetroarch } from "holy-retroarch"
import { TCore } from "holy-retroarch/dist/retroarch-module/CoreManager"
import { useEffect, useRef } from "react"
import { waitMs } from "utils/waitMs"

type EmulatorProps = {
  core: TCore
  rom?: Uint8Array
  save?: Uint8Array
  onStarted: (stream: MediaStream) => void
}

export const Emulator: React.FunctionComponent<EmulatorProps> = ({
  core,
  rom,
  save,
  onStarted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const startRom = async () => {
      const retroarch = await createRetroarch({
        core,
        rom,
        save,
        canvas: canvasRef.current as HTMLCanvasElement,
      })

      await waitMs(1000)

      retroarch.start()

      await waitMs(1000)

      const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
      const videoStream = canvasEl.captureStream(60)
      const audioStream = window.RA.xdest.stream as MediaStream

      const stream = new MediaStream()
      videoStream.getTracks().forEach((track) => stream.addTrack(track))
      audioStream.getTracks().forEach((track) => stream.addTrack(track))

      onStarted(stream)
    }

    startRom()
  }, [])

  return <canvas ref={canvasRef} id="canvas"></canvas>
}
