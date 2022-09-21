import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import SocketContextComponent from 'contexts/Socket/Component'
import { SocketInfo } from './routes/root/SocketInfo'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>users list</div>,
  },
  {
    path: '/create',
    element: <div>new game</div>,
  },
  {
    path: '/manager',
    element: <div>manager page</div>,
  },
  {
    path: '/player',
    element: <div>player page</div>,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <>
    <SocketContextComponent>
      <RouterProvider router={router} />
      <SocketInfo />
    </SocketContextComponent>
  </>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
