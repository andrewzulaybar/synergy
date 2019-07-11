import React, { Component } from "react";
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Home from '../home/Home';
import Sidebar from "./sidebar/Sidebar";
import './sidebar/Sidebar.css';

class Routes extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Sidebar />
                    <Route exact path="/" component={Home} />
                    <Route path="/overview" />
                </div>
            </Router>
        );
    }
}

export default Routes;