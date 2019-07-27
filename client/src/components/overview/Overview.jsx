import { Layout, Menu } from 'antd';
import React, { Component } from 'react';
import { BrowserRouter, NavLink, Route } from "react-router-dom";

import LineChart from './lineChart/LineChart';
import "./Overview.css";

class Overview extends Component {
  state = {
    current: 'all',
  };

  handleClick = e => {
    this.setState({ type: e.key });
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout style={{ marginLeft: 200 }}>
          <Layout.Content>
            <BrowserRouter>
              <Menu
                className="menu"
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
              >
                <Menu.Item key="all">
                  <NavLink to="/overview">All</NavLink>
                </Menu.Item>
                <Menu.Item key="td">
                  <NavLink to="/#">TD</NavLink>
                </Menu.Item>
                <Menu.Item key="bmo">
                  <NavLink to="/#">BMO</NavLink>
                </Menu.Item>
                <Menu.Item key="vancity">
                  <NavLink to="/#">Vancity</NavLink>
                </Menu.Item>
                <Menu.Item key="cash">
                  <NavLink to="/#">Cash</NavLink>
                </Menu.Item>
              </Menu>
              <Route exact path="/overview" component={LineChart} />
            </BrowserRouter>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default Overview;