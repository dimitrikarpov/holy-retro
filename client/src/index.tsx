import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import SocketProvider from 'contexts/Socket/Provider'
import { SocketInfo } from './routes/root/SocketInfo'
import { Users } from 'routes/root/Users'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Users />,
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
    <SocketProvider>
      <RouterProvider router={router} />
      <SocketInfo />
    </SocketProvider>
  </>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
