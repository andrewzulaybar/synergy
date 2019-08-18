import React, { Component } from 'react';
import { Card, Col, Row } from "antd";
import AddAccount from "./AddAccount";

class ListOfAccounts extends Component {
  render() {
    const header = (
      <Row>
        <Col span={12} align="left">
          <h2 className="ant-typography">
            All Accounts
          </h2>
        </Col>
        <Col span={12} align="right">
          <AddAccount />
        </Col>
      </Row>
    );

    return (
      <Card id="accounts" bordered={false} title={header} />
    );
  }
}

export default ListOfAccounts;