
import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authAction';

const SignedInLinks = (props) => {
  
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/holdings'>Holdings</NavLink></li>
        <li><NavLink to='/updateprofile'>Profile</NavLink></li>
        <li><a onClick={props.signOut}>Sign Out</a> </li>
      </ul>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);