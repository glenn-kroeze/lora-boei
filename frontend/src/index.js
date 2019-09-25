import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getDevices } from './api';
import { Map, DeviceList, RawView } from './components';
import './main.scss';
import styles from './styles.scss';

const noop = () => null;

const App = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    useEffect(
        () => {
            getDevices().then(setDevices)
        }, [])

    return (
        <div className={styles.container}>
            <Map devices={devices} selectedDeviceId={selectedDeviceId} onSelect={setSelectedDeviceId} />
            <DeviceList devices={devices} selectedDeviceId={selectedDeviceId} onSelect={setSelectedDeviceId} />
            <RawView devices={devices} selectedDeviceId={selectedDeviceId} />
        </div>
    );
}
ReactDOM.render(<App />, document.getElementById('root'));