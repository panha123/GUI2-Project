import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/authAction';
import firebase from 'firebase/app';


export class SignUp extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        income: 0,
        filingStatus: '',
        baseTax: 0,
        dependents: ''

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.signUp(this.state);
    }

    handleUploadStart = () => this.setState({isUploading: true, progress: 0});
    
    handleProgress = (progress) => this.setState({progress});
    
    handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
    }

    handleUploadSuccess = (filename) => {
        this.setState({avatar: filename, progress: 100, isUploading: false});
        firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({avatarURL: url}));
    };

    render() {
        const { auth, authError } = this.props;
        if(auth.uid) {
            return <Redirect to='/'/>
        }
        return (
            <div className="container z-depth-3 signup">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Sign Up</h5>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="firstName">First Name</label>
                        <input required type="text" id="firstName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input required type="text" id="lastName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input required type="email" id="email" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input required type="password" id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="income">Income</label>
                        <input required type="number" min="0" id="income" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="filingstatus">Filing Status</label>
                        <input required type="text" id="filingstatus" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="dependents">Number of Dependents</label>
                        <input required type="number" min="0" id="dependents" onChange={this.handleChange}/>
                    </div>
                                       
                    <br/><br/>
                    <button type="submit" className="waves-effect waves-light green btn" value="submit">Sign Up</button> 
                        <div className="red-text center">
                            { authError ? <p>{ authError }</p> : null }
                        </div>
                    
                </form>
            </div>
        )
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
        signUp: (newUser) => dispatch(signUp(newUser))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
