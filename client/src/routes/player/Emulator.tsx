import { createRetroarch, Retroarch } from "holy-retroarch"
import { TCore } from "holy-retroarch/dist/retroarch-module/CoreManager"
import { useEffect, useRef } from "react"

type EmulatorProps = {
  core: TCore
  rom?: Uint8Array
  save?: Uint8Array
  onStarted: (stream: MediaStream) => void
}

// let retroarch: Retroarch

export const Emulator: React.FunctionComponent<EmulatorProps> = ({
  core,
  rom,
  save,
  onStarted,
}) => {
  console.log("rendered?????????????????????")

  const retroarchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const startEmulator = async () => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement
      const retroarch = new Retroarch(core, canvas)

      await retroarch.init()
      retroarch.copyConfig()

      if (rom) retroarch.copyRom(rom)

      setTimeout(() => {
        retroarch.start()
        setTimeout(() => {
          const canvasEl = document.getElementById(
            "canvas"
          ) as HTMLCanvasElement
          const videoStream = canvasEl.captureStream(60)
          const audioStream = window.RA.xdest.stream as MediaStream

          const stream = new MediaStream()
          videoStream.getTracks().forEach((track) => stream.addTrack(track))
          audioStream.getTracks().forEach((track) => stream.addTrack(track))

          onStarted(stream)

          console.log({ stream })
        }, 1000)
      }, 250)
    }

    startEmulator()
  }, [])

  return <div ref={retroarchContainerRef}></div>
}
