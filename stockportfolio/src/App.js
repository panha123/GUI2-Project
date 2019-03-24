import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
<<<<<<< HEAD
=======
import Dashboard2 from "./components/dashboard/Dashboard2";
>>>>>>> 500b156e1bab4aa174ab71a6feb8023fc5a6b890
import ProjectDetails from "./components/projects/ProjectDetails";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import ForgetPassword from "./components/auth/ForgetPassword";
import Dashboard2 from './components/dashboard/Dashboard2';

class App extends Component {
<<<<<<< HEAD
  render() {
    return (
=======
      render() {
        return (
>>>>>>> 500b156e1bab4aa174ab71a6feb8023fc5a6b890
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard2} />
            <Route path="/project/:id" component={ProjectDetails} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/createproject" component={CreateProject} />
            <Route path="/ForgetPassword" component={ForgetPassword} />
          </Switch>
        </div>
      </BrowserRouter>
    );
   }
  }


  
export default App;
