import React from 'react'
import { Link } from 'react-router-dom'
function Header() {

  return (
    <div>
       <header className="flex justify-around items-center bg-blue-600 text-white p-4 shadow-md">
        <Link to="/" className="nav-link text-lg font-semibold cursor-pointer">Home</Link>
        <Link to="/Friends" className="nav-link text-lg font-semibold cursor-pointer">Friends</Link>
        <Link to="/Posts" className="nav-link text-lg font-semibold cursor-pointer">Posts</Link>
        <Link to="/Profile" className="nav-link text-lg font-semibold cursor-pointer">Profile</Link>
      </header>
    </div>
  )
}

export default Header
