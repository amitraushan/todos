import React, { Component } from "react";
import logo from "./logo.svg";
import { Switch } from "react-router";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import "./App.css";
import ToDo from "./ToDo/todo.js";

@inject("Store")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.renderHome = this.renderHome.bind(this);
  }
  renderHome() {
    return (
      <section className="App-page">
        <h1>Home</h1>
      </section>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <ul>
              {/* <li>
                <Link to="/" className="App-link">
                  Home
                </Link>
              </li> */}
              <li>
                <Link to="/" className="App-link">
                  Todo
                </Link>
              </li>
            </ul>
          </header>
          <Switch>
            {/* <Route exact path="/" render={this.renderHome} /> */}
            <Route path="/" component={ToDo} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  Store: PropTypes.object
};
export default App;
