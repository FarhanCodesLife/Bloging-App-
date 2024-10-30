import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AllBlogs from './pages/SingleBlog.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Userblog from './pages/Userblog.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
let router = createBrowserRouter([{
  path:'/',
  element:<Layout/>,
  children:[
    {
      path:'',
      element:<App/>
    },
    {
      path:'/single/:blogid',
      element:<AllBlogs/>,
    },
    {
      path:'login',
      element:<Login/>,
    },
    {
      path:'about',
      element:<About/>,
    },
    {
      path:'contact',
      element:<Contact/>,
    },
    
    {
      path:'register',
      element:<Register/>
    },
    {
      path:'allblogs',
      element:<AllBlogs/>
    },
    {
      path:'profile',
      element:<Profile/>
    },
    {
      path:'dashboard',
      element:<Dashboard/>
    },{
      path:"/single/:blogid/userblog/:uid",
       element:<Userblog />
    }
  ]
}])


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
