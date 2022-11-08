import { createRetroarch, Retroarch } from "holy-retroarch"
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
  const retroarchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("fffff", retroarchContainerRef.current)

    const startEmulator = async () => {
      const retroarch = new Retroarch(
        core,
        document.getElementById("canvas") as HTMLCanvasElement
      )

      await retroarch.init()
      retroarch.copyConfig()

      if (rom) retroarch.copyRom(rom)

      await waitMs(250)

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

    startEmulator()
  }, [])

  return <div ref={retroarchContainerRef}></div>
}
