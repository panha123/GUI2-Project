import React, { Component } from 'react'
import { fetchUserProfile } from '../../store/actions/FetchAction';
import { connect } from 'react-redux';

export class Holdings extends Component {
    state = {
        firstName: ''
    }
    

    render() {
        let value = this.props.fetchUserProfile(this.state);
        console.log("parsed json: ", value);
        return (
        <div>
            {/* <h1>TEST {value.lastName}</h1> */}
            <div>
            <div className="input-field">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" onLoad={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="income">Income</label>
                        <input type="text" id="income" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="filingstatus">Filing Status</label>
                        <input type="text" id="filingstatus" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="dependents">Number of Dependents</label>
                        <input type="text" id="dependents" onChange={this.handleChange}/>
                    </div>
                    <input className="btn light-blue lighten-1 z-depth-0 " onClick={this.handleSubmit} value="Submit"/ >
            </div>
        </div>
        )
    }
}


 const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserProfile: (project) => dispatch(fetchUserProfile(project))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( Holdings)