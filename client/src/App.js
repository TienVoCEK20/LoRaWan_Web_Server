import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect } from 'react';

class App extends React.Component{

    state = {
        sensors_data: []
    };

    componentDidMount = () => {
        this.getSenSorsData();
    }

    getSensorsData = () => {
        axios.get('/api')
            .then((response) => {
                const data = response.data;
                this.setState({sensors_data: data});
                console.log('Data has been received!!!');
            })
            .catch(() => {
                alert('Data has been received!!');
            });
    }
    displaySensorsData = (sensors_data) => {
        //if (!sensors_data.length) return null;

        //sensors_data.map(() => {
            <div>
                <p>{sensors_data.tem}</p>
            </div>
        //});
    };

    render() {
        return(
        <div>
            <h2> Welcome to my App </h2>
            <div>
                {this.displaySensorsData()}
            </div>
        </div>
        )
    };
}



export default App;
