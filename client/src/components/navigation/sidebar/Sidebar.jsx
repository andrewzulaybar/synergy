import { Icon, Layout, Menu } from 'antd';
import React, { Component } from "react";
import { NavLink, withRouter } from 'react-router-dom';

class Sidebar extends Component {
  render() {
    return (
      <Layout.Sider className="sidebar">
        <Menu mode="inline" selectedKeys={[this.props.location.pathname]}>
          <Menu.Item key="/">
            <NavLink to="/">
              <Icon type="home"/>
              <span className="nav-text">Home</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/overview">
            <NavLink to="/overview">
              <Icon type="file"/>
              <span className="nav-text">Overview</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
    );
  }
}

export default withRouter(Sidebar);