import React, { Component } from "react";
import { BrowserRouter, Route, } from 'react-router-dom';

import Home from '../home/Home';
import Overview from '../overview/Overview';
import Sidebar from './sidebar/Sidebar';
import './sidebar/Sidebar.css';

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Sidebar />
        <Route exact path="/" component={Home} />
        <Route path="/overview" component={Overview} />
      </BrowserRouter>
    );
  }
}

export default Router;