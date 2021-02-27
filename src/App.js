import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ArrowRight } from 'react-bootstrap-icons';
import { Bell } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import React, { Component } from 'react'

//Personals
import { IssueTable, NewIssueForm, ViewIssueForm } from './issue.js'

import './App.css';

const Display = {
  LIST_ISSUES: 0,
  VIEW_ISSUE: 1,
  EDIT_ISSUE: 2,
  NEW_ISSUE: 3,
  LEAVE_COMMENT: 4,

};

class App extends Component {
  constructor(props) {
    super(props);
    this.onCreateIssueClicked = this.onCreateIssueClicked.bind(this);
    this.onHomeClicked = this.onHomeClicked.bind(this)
    this.state = {
      issueCreated: false,
      display: Display.LIST_ISSUES
    }
  }



  onCreateIssueClicked(event) {
    this.setState({ display: Display.NEW_ISSUE });
    console.log("Create Issue called");
  }


  onTableRowClicked(event) {
    this.setState({ display: Display.VIEW_ISSUE });
    console.log("Was this called?");
  }

 onHomeClicked(event) {
    this.setState({ display: Display.LIST_ISSUES });
    console.log("Was this called?");
  }

  render() {
    return (
      <div className="App">
        <div className="row">
          <AppNav onClicked={this.onCreateIssueClicked.bind(this)} onHomeClicked={this.onHomeClicked.bind(this)}/>
          <ContentSection display={this.state.display} onRowClicked={this.onTableRowClicked.bind(this)} />
        </div >
      </div>);
  }
}

function AppNav(props) {
  return (
    <Navbar bg="light" expand="lg" style={{ padding: "10px 25px 500px 25px " }} >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="flex-column">

          <Navbar.Brand href="#home" onClick={props.onHomeClicked}>Greg Bug Tracker <Bell /> </Navbar.Brand>
          <br />
          <Button className="button" onClick={props.onClicked}>Create {props.status}</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

class ContentSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.props.display,
      active_issue: 0
    };
  }
  static getDerivedStateFromProps(props, state) {
    return { display: props.display }
  }

  handleIssueClicked(id) {
    this.props.onRowClicked(id);
    this.setState({ display: Display.VIEW_ISSUE });
    this.setState({ active_issue: id });
    console.log("YEET" + this.state.display)
  }

  render() {

    console.log("This Display Is Set to:" + this.state.display)
    switch (this.state.display) {
      case Display.LIST_ISSUES:
        return (<IssueTable issueClicked={(id) => this.handleIssueClicked(id)} />);
      case Display.NEW_ISSUE:
        return (<NewIssueForm />);
      case Display.VIEW_ISSUE:
        return (<ViewIssueForm issueID={this.state.active_issue} />)
    }

    return (<IssueTable issueClicked={(id) => this.handleIssueClicked(id)} />);

  }
}


function LoginPage() {
  return (
    <form className="form-signin">
      <img className="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72" />
      <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" className="sr-only">Email address</label>
      <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
      <label for="inputPassword" className="sr-only">Password</label>
      <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
      <div className="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me </input>
        </label>
      </div>
      <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p className="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>

  );
}



export default App;
