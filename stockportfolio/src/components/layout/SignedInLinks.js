
import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authAction';

const SignedInLinks = (props) => {
  
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/createproject'>New Project</NavLink></li>
        {/* <li><NavLink to='/dashboard'>Dashboard</NavLink></li> */}
        <li><NavLink to='/profile'>Profile</NavLink></li>
        {/* <li><NavLink to='/' className="btn btn-floating pink lighten-1">MK</NavLink></li> */}
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