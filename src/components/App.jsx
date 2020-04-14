import React from 'react';
import Location from './Location';
import World from './World';
import Countries from './Countries';
import styles from '../styles/App.module.scss';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            local: {},
            timeline: {},
            countries: {}
        }
    }

    componentDidMount() {
        fetch("https://corona-api.com/timeline")
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(`Status ${response.status}`)
            }
        })
        .then(response => response.json())
        .then(timelineData => this.setState(() => ({timeline: timelineData})))
        .catch(e => this.setState(() => ({timeline: {message: e.message}})));

        fetch("https://corona-api.com/countries")
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(`Status ${response.status}`)
            }
        })
        .then(response => response.json())
        .then(countriesData => {
            countriesData.data.map(country => country.latest_data.active = country.latest_data.confirmed - country.latest_data.deaths - country.latest_data.recovered);
            this.setState(() => ({countries: countriesData}));
        })
        .catch(e => this.setState(() => ({countries: {message: e.message}})))
        .then( () => new Promise((resolve) => {navigator.geolocation.getCurrentPosition(resolve)}))
        .then(position => fetch(`https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`))
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(`Status ${response.status}`)
            }
        })
        .then(response => response.json())
        .then(location => this.setState(() => ({local: this.state.countries.data.find(country => country.code === location.prov)})))
        .catch(e => this.setState(() => ({local: {message: e.message}})));
    }

    render() {
        return(
            <div className={styles.container}>
                <h1 className="header">Covid-19</h1>
                <Location local={this.state.local}></Location>
                <World timeline={this.state.timeline}></World>
                <Countries countries={this.state.countries}></Countries>
            </div>
        );
    }
}

export default App;