import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect } from 'react';

class App extends React.Component{

    state = {
        _id: '',
        Time: '',
        Device_ID: '',
        Humidity: '',
        Temperature: '',
        posts: []        
    };

    componentDidMount = () => {
        this.getSensorsData();
    };

    getSensorsData = () => {
        axios.get('/api')
            .then((response) => {
                const data = response.data;
                this.setState({ posts: data });
                console.log('Data has been received!!!');
            })
            .catch((err) => {
                throw(err);
            });
    }
    displaySensorsData = (posts) => {
        if (!posts.length)
         {
             console.log('No data');
             return null;
         }
        else
             console.log('length: ',posts.length)
        return posts.map((post,index) => {
            <div key={index}>
                <h3>{post._id}</h3>
            </div>
        });
    };
    render() {
        console.log('State: ', this.state);

        return(
        <div>
            <h2> Welcome to my App </h2>
            <div className="data-">
                {this.displaySensorsData(this.state.posts)}
            </div>
        </div>
        )
    };
}



export default App;
