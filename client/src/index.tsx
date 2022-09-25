import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import SocketProvider from 'contexts/Socket/Provider'
import { SocketInfo } from './routes/root/SocketInfo'
import { Users } from 'routes/root/Users'
import { CreateGame } from 'routes/create/CreateGame'
import { Player } from 'routes/player/Player'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <>
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Users />}></Route>
          <Route path="/create" element={<CreateGame />}></Route>
          <Route path="/player" element={<Player />}></Route>
        </Routes>
        <SocketInfo />
      </SocketProvider>
    </BrowserRouter>
  </>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
