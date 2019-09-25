import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from './styles.scss';

export default ({ devices, selectedDeviceId, onSelect }) => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (selectedDeviceId) {
            const device = devices.find(d => d.id === selectedDeviceId);
            map.panTo(device.location);
        }
    }, [selectedDeviceId])

    return (
        <LoadScript
            id="script-loader"
        >
            <GoogleMap
                id='map'
                mapContainerClassName={styles.mapContainer}
                zoom={14}
                center={{ lat: 51.911, lng: 4.486 }}
                onLoad={o => setMap(o.data.map)}
            >
                {devices.map(d => (
                        <Marker
                            position={d.location}
                            onClick={() => onSelect(d)}
                        />
                ))}
            </GoogleMap>
        </LoadScript>
    )
}
