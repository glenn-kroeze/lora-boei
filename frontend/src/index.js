import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { getDevices } from './api';
import { Map, DeviceList, RawView } from './components';
import './main.scss';
import styles from './styles.scss';



const App = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const selectedDevice = devices.find(d => d.id === selectedDeviceId);

    const handleKey = e => {
        const selectedIndex = devices.indexOf(selectedDevice);
        if (e.key === 'ArrowUp') {
            const previous = devices[selectedIndex - 1];
            setSelectedDeviceId(previous ? previous.id : devices.length);
        }

        if (e.key === 'ArrowDown') {
            const next = devices[selectedIndex + 1];

            setSelectedDeviceId(next ? next.id : devices[0].id);
        }
    }

    useEffect(() => {
            getDevices().then(setDevices);
        }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [selectedDeviceId, devices])

    return (
        <div className={styles.container}>
            <Map devices={devices} selectedDeviceId={selectedDeviceId} onSelect={setSelectedDeviceId} />
            <DeviceList devices={devices} selectedDeviceId={selectedDeviceId} onSelect={setSelectedDeviceId} />
            <RawView devices={devices} selectedDeviceId={selectedDeviceId} />
        </div>
    );
}
ReactDOM.render(<App />, document.getElementById('root'));