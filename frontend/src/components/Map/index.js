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

    //Remove annoying prompt
    useEffect(() => {
        if(map) {
            const mapElem = document.getElementById('map');
            const tryToRemove = () => {
                const numberOfChildren = mapElem.childElementCount;
                if(numberOfChildren < 2) {
                    setTimeout(tryToRemove, 100);
                } else {
                    mapElem.lastChild.remove();
                }
            }
            tryToRemove();
        }
    }, [map])

    return (
        <LoadScript
            id="script-loader"
        >
            <GoogleMap
                id='map'
                mapContainerClassName={styles.mapContainer}
                zoom={14}
                center={selectedDeviceId 
                    ? devices.find(d => d.id === selectedDeviceId).location
                    : { lat: 51.911, lng: 4.486 }}
                onLoad={o => setMap(o.data.map)}
            >
                {devices.map(d => (
                        <Marker
                            key={d.id}
                            position={d.location}
                            onClick={() => onSelect(d.id)}
                        />
                ))}
            </GoogleMap>
        </LoadScript>
    )
}
