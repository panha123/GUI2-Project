import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/signin'><h5>Login</h5></NavLink></li>
        <li><NavLink to='/signup'><h5>Signup</h5></NavLink></li>
      </ul>
    </div>
  )
}

export default SignedOutLinks