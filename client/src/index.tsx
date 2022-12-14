// import { createRetroarch, Retroarch } from "holy-retroarch"

import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import SocketProvider from "contexts/socket/SocketProvider"
import { SocketInfo } from "./routes/root/SocketInfo"
import { CreateGame } from "routes/create/CreateGame"
import { Player } from "routes/player/Player"
import { PeersProvider } from "contexts/peers/PeersProvider"
import { Home } from "routes/root/Home"

// const canvas = document.getElementById("canvas") as HTMLCanvasElement

// export let retroarchLocal: Retroarch

// const downloadRA = async () => {
//   retroarchLocal = await createRetroarch({ core: "nestopia" })
// }

// downloadRA()

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <>
    <BrowserRouter>
      <SocketProvider>
        <PeersProvider>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/create" element={<CreateGame />}></Route>
            <Route path="/player" element={<Player />}></Route>
          </Routes>
          <SocketInfo />
        </PeersProvider>
      </SocketProvider>
    </BrowserRouter>
  </>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
