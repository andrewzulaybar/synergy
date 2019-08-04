import { Icon, Layout, Menu } from 'antd';
import React, { Component } from "react";
import { NavLink, withRouter } from 'react-router-dom';

class Sidebar extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed })
  };

  render() {
    return (
      <Layout.Sider
        breakpoint="md"
        className="sidebar"
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        theme="light"
      >
        <Menu
          mode="inline"
          selectedKeys={[this.props.location.pathname]}
        >
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