import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

class App extends Component {
    state = {
        isConnected: false,
    };

    // call back-end API to retrieve data
    componentDidMount() {
        axios.get('/api')
            .then(res => {
                this.setState({
                    isConnected: res.data.isConnected,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.isConnected
                        ? "Express back-end is connected!"
                        : "Express back-end is not connected"}
                </header>
            </div>
        );
    }
}

export default App;
