import React from 'react'
import { Link } from 'react-router-dom'
import { auth, signOutUser } from '../config/firebase/firebasefunctions'

const Navbar = () => {

  
  

  return (
<>
<div className="navbar bg-base-1 bg-[#7749F8]">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">Bloging App</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal  text-lg font-bold">
      <li><Link to='login'>login</Link></li>
      <li>
        <details className='z-10'>
          <summary>Manu</summary>
          <ul className="bg-base-100 rounded-t-none p-2 flex-row">
            <li><Link to='dashboard'>Dashboard</Link> </li>
            <li><Link to='profile'>profile</Link> </li>
            <li><Link to=''>allblogs</Link> </li>
            <li ><button onClick={signOutUser}><Link to='login'>Logout</Link></button></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>

</>


)
}

export default Navbar