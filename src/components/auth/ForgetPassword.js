import React, { Component } from "react";
import { connect } from 'react-redux';
import { forgetPassword } from '../../store/actions/authAction';

export class ForgetPassword extends Component {

    constructor( props ) {
        super( props );
        this.state = {
            email: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = (e) => {

        if (this.state.email === "") {
            alert("The email field is empty!!!")
            e.preventDefault();
            return
        }

        e.preventDefault();
        this.props.forgetPassword(this.state);
        this.props.history.push('/');
    }

	render() {
        
		return (
			<div className="container">
                <div className="row">
                    <div className="col s3"></div>
                    <form onSubmit={this.handleSubmit} className="white col m6">
                        <h5 className="grey-text text-darken-3">Reset Password</h5> 
                        <div className="input-field">
                            <label htmlFor="email">You're email address</label>
                            <input type="email"id="email" onChange={this.handleChange}/>
                        </div>
                        <div className="input-field"> 
                            <button className="btn orange lighten-1 z-depth-0" type="submit">Reset my password</button>
                        </div>
                    </form>
                    <div className="col s3"></div>
                </div>
            </div>
        );
        
    } 
}
    
const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        authError: state.auth.authError
    }
}

const mapDispatchToProps =(dispatch) => {
    return {
        forgetPassword: (newUser) => dispatch(forgetPassword(newUser))
    }
}   

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);

