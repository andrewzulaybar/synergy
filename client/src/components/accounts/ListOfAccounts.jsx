import { Card, Col, List, Row, Skeleton } from 'antd';
import React from 'react';

import AddAccount from './AddAccount';
import { formatAccounts } from '../../utils/accounts/accounts';
import './ListOfAccounts.css';

const ListOfAccounts = ({ accounts, isLoading }) => {
  const credit = formatAccounts('credit', accounts);
  const depository = formatAccounts('depository', accounts);

  const header = (
    <Row>
      <Col span={18} align="left">
        <h2 className="ant-typography">All Accounts</h2>
      </Col>
      <Col span={6} align="right">
          <AddAccount />
      </Col>
    </Row>
  );

  return (
    <Card id="all-accounts" bordered={false} title={header}>
      {isLoading
        ? <Skeleton active paragraph={{ rows: 6 }} />
        : <Col span={24}>
          <Card bordered={false} id="credit" title={<h2>Credit</h2>}>
            <List
              itemLayout="horizontal"
              dataSource={credit}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item} />
                </List.Item>
              )}
            />
          </Card>
          <Card bordered={false} id="depository" title={<h2>Depository</h2>}>
            <List
              itemLayout="horizontal"
              dataSource={depository}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      }
    </Card>
  )
};

export default ListOfAccounts;