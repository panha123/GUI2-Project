import React, { Component } from 'react'
import { connect } from 'react-redux';
import { signIn } from '../../store/actions/authAction';
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom'
import Stock from '../../img/stock.jpg';

export class SignIn extends Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.signIn(this.state);
    }
    render() {
        const { authError, auth } = this.props;
        if(auth.uid) {
            return <Redirect to='/'/>
        }
        return (
            <div className="container signin center z-depth-4">
                <div className="card-image cdimg">
                </div>
                <form onSubmit={this.handleSubmit} className=" card-content">
                    <h6 className="grey-text text-darken-3">Sign In</h6> 
                    <div className="input-field">
                        <label htmlFor="email"><h6>Email</h6></label>
                        <input type="email"id="email" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password"><h6>Password</h6></label>
                        <input type="password"id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field"> 
                    <br/>
                    <button type="submit" className="waves-effect waves-light green btn" value="submit">Log In</button> 
                        <div className="red-text center">
                            { authError ? <p>{authError}</p> : null}
                        </div>
                    </div>
                    <div className="input-field">
                        <NavLink to='/forgetpassword'>Forgot Password</NavLink>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps =(dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);


