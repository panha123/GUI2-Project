import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class UpdateProfile extends Component {
    render() {
        return (
        <div className="container">
            <form onSubmit={this.handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Update Profile</h5>
                <br/>
                <div className="input-field">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" onChange={this.handleChange}/>
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
                <div className="input-field"> 
                    <button className="btn light-blue lighten-1 z-depth-0">Submit</button>
                </div>
            </form>
        </div>

        );
    }
}