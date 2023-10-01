import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import VncView from './pages/VncView'
import {WebContextProvider} from './context/WebContext'
import ContainerPage from './pages/ContainerPage'
import ViewContainers from './pages/ViewContainers'
import ViewImages from './pages/ViewImages'
import ImagePage from './pages/ImagePage'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/vncview/:url',
    element: <VncView />
  },
  {
    path: '/containers',
    element: <ViewContainers />
  },
  {
    path: "/images",
    element: <ViewImages />
  },
  {
    path: '/container/:containerId',
    element: <ContainerPage />
  },
  {
    path: '/image/:imageId',
    element: <ImagePage />
  }
])

function App() {
  return (
    <WebContextProvider>
      <RouterProvider router={router} />
    </WebContextProvider>
  )
}

export default App
