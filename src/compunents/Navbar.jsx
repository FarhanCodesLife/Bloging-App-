import React from 'react'
import { Link } from 'react-router-dom'
import { auth, signOutUser } from '../config/firebase/firebasefunctions'

const Navbar = () => {

  
  

  return (
<>
<div className="navbar bg-base-1 bg-[#f7f7f7]">
  <div className="flex-1">
    <div className=' w-20 rounded-full ml-5  overflow-hidden'>
    <Link to=''>
    <img  src="https://i.pinimg.com/originals/db/a1/a7/dba1a72669895c3b4420b762433a5461.png" alt="logo" />
    </Link>
    </div>
    <a className=" font-bold text-xl text-[#000000]"><Link to=''>Bloging App</Link></a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal  text-lg font-bold">
      <li><Link to='login'>Blog</Link></li>
      <li><Link to='login'>About</Link></li>
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