import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/authAction';
import firebase from 'firebase/app';
import Select from 'react-select';

const options = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'head', label: 'Head of Household' }
  ];

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

    handleFiling = (e) => {
        console.log(e.value);
        this.setState({
            filingstatus: e.value
        })
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
                <form onSubmit={this.handleSubmit} className="white" id="signedIn">
                    <h6 className="grey-text text-darken-3"><strong>Sign Up</strong></h6>
                    <br/>
                    <div className="input-field">
                        <label htmlFor="firstName"><h6>First Name</h6></label>
                        <input required type="text" id="firstName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName"><h6>Last Name</h6></label>
                        <input required type="text" id="lastName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="email"><h6>Email</h6></label>
                        <input required type="email" id="email" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password"><h6>Password</h6></label>
                        <input required type="password" id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="income"><h6>Income</h6></label>
                        <input required type="number" min="0" id="income" onChange={this.handleChange}/>
                    </div>

                    <label htmlFor="filingstatus"><h6>Filing Status</h6></label>
                    <div className="input-field">
                        <Select
                            placeholder="Filing Status"
                            id="filingstatus"
                            value={{label: this.state.filingstatus , value: this.state.filingstatus}}
                            onChange={this.handleFiling}
                            options={options}
                        />
                    </div>
                    {/* <div className="input-field">
                        <label htmlFor="dependents">Number of Dependents</label>
                        <input required type="number" min="0" id="dependents" onChange={this.handleChange}/>
                    </div> */}
                                       
                    <br/><br/> <br/><br/><br/>
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
