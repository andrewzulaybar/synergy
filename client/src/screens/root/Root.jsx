import { Layout } from "antd";
import React, { Component } from "react";
import { BrowserRouter, Route } from 'react-router-dom';
import 'antd/dist/antd.css';

import Accounts from '../accounts/Accounts';
import Home from '../home/Home';
import Sidebar from '../sidebar/Sidebar';
import '../sidebar/Sidebar.css';

class Root extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Sidebar />
          <Route exact path="/" component={Home} />
          <Route exact path="/accounts" component={Accounts} />
        </Layout>
      </BrowserRouter>
    );
  }
}

export default Root;