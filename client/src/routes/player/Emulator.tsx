import { Retroarch } from "holy-retroarch"
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"
import { waitMs } from "utils/waitMs"

type EmulatorProps = {
  coreUrl: string
  rom: Uint8Array
  // save?: Uint8Array
  onStarted: (stream: MediaStream) => void
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement

export const Emulator: React.FunctionComponent<EmulatorProps> = memo(
  ({ coreUrl, rom, onStarted }) => {
    // const canvasRef = useRef<HTMLCanvasElement>(null)
    const raRef = useRef<Retroarch>(new Retroarch(coreUrl, canvas))

    // const [isReady, setIsReady] = useState<Boolean>(false)

    useEffect(() => {
      const prepareRa = async () => {
        await raRef.current.init()
        raRef.current.copyConfig()
        raRef.current.copyRom(rom)
        // await waitMs(500)
        // raRef.current.start()

        // setIsReady(true)
      }

      prepareRa()
    }, [])

    const onStartClick = async () => {
      raRef.current.start()

      await waitMs(1000)

      const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
      const videoStream = canvasEl.captureStream(60)
      const audioStream = window.RA.xdest.stream as MediaStream

      const stream = new MediaStream()
      videoStream.getTracks().forEach((track) => stream.addTrack(track))
      audioStream.getTracks().forEach((track) => stream.addTrack(track))

      onStarted(stream)
    }

    return (
      <h3>
        <button onClick={onStartClick}>start!</button>
      </h3>
    )

    // return <canvas ref={canvasRef} id="canvas"></canvas>
  }
)

// const startRom = async () => {
//   const retroarch = await createRetroarch({
//     core: "fceumm",
//     rom,
//     // save,
//     canvas: canvasRef.current as HTMLCanvasElement,
//     // canvas,
//   })

//   // await waitMs(1000)

//   retroarch.start()

//   // await waitMs(1000)

//   // const canvasEl = document.getElementById("canvas") as HTMLCanvasElement
//   // const videoStream = canvasEl.captureStream(60)
//   // const audioStream = window.RA.xdest.stream as MediaStream

//   // const stream = new MediaStream()
//   // videoStream.getTracks().forEach((track) => stream.addTrack(track))
//   // audioStream.getTracks().forEach((track) => stream.addTrack(track))

//   // onStarted(stream)
// }
