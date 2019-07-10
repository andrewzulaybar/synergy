import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        isConnected: false,
    };

    componentDidMount() {
        this.retrieveTransactions()
            .then(res => this.setState({ isConnected: res.isConnected }))
            .catch(err => console.log(err));
    }

    retrieveTransactions = async () => {
        const response = await fetch('/api');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

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
