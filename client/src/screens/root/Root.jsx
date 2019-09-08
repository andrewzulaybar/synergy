import { Layout } from 'antd';
import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter, Route } from 'react-router-dom';
import 'antd/dist/antd.css';

import Loading from './Loading';
import './Root.css';
import '../sidebar/Sidebar.css';

const Sidebar = Loadable({
  loader: () => import('../sidebar/Sidebar'),
  loading: Loading,
});

const Home = Loadable({
  loader: () => import('../home/Home'),
  loading: () => { return null },
});

const Accounts = Loadable({
  loader: () => import('../accounts/Accounts'),
  loading: () => { return null },
});

const Root = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Sidebar />
        <Route exact path="/" component={Home} />
        <Route exact path="/accounts" component={Accounts} />
      </Layout>
    </BrowserRouter>
  );
};

export default Root;