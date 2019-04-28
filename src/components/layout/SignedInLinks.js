import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authAction';

const SignedInLinks = (props) => {
  
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/'><h5>Home</h5></NavLink></li>
        <li><NavLink to='/updateprofile'><h5>Profile</h5></NavLink></li>
        <li><NavLink to='/holdings'><h5>Holdings</h5></NavLink></li>
        <li><a onClick={props.signOut}><h5>Sign Out</h5></a> </li>
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