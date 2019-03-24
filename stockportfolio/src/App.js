import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
// import Dashboard3 from "./components/dashboard/Dashboard3";
import ProjectDetails from "./components/projects/ProjectDetails";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import ForgetPassword from "./components/auth/forgetpassword";
import Dashboard2 from './components/dashboard/Dashboard2';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard2} />
            {/* <Route exact path="/" component={Dashboard} /> */}
            <Route exact path="/" component={Dashboard2} />
            <Route path="/project/:id" component={ProjectDetails} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/createproject" component={CreateProject} />
            <Route path="/forgetpassword" component={ForgetPassword} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
