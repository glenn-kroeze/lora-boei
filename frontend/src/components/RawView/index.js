import React, { useState, useEffect } from 'react';
import { getMeasurements } from '../../api';
import humanDate from 'human-date';
import classNames from 'classnames';
import styles from './styles.scss';

const convert = value => ({
    number: value,
    string: value,
    object: JSON.stringify(value),
    object: JSON.stringify(value)
}[typeof value])

export default ({ devices, selectedDeviceId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [measurements, setMeasurements] = useState([]);
    const [expanded, setExpanded] = useState({});

    const device = devices.find(d => d.id === selectedDeviceId) || null;

    useEffect(() => {
        if (selectedDeviceId) {
            console.log(selectedDeviceId);
            getMeasurements(selectedDeviceId).then(setMeasurements);
            setExpanded({});
            setIsOpen(true);
        }
    }, [selectedDeviceId])

    const renderEntry = ([key, val]) => (
        <div key={key} className={styles.entry}>
            <div className={styles.key}>{key}:</div>
            <div className={styles.value}>{convert(val)}</div>
        </div>
    )

    const renderMeasurement = ({timestamp, alwaysExpanded, ...others}, i) => {
        const isExpanded = alwaysExpanded || expanded[i];
        return (
            <div key={i} className={styles.measurement}>
                <div className={styles.measurementHeading} onClick={() => setExpanded({ ...expanded, [i]: !isExpanded })}>
                    <div className={styles.timestamp}>{`${timestamp} (${humanDate.relativeTime(timestamp)})`}</div>
                    <div className={styles.expandButton}>{isExpanded ? '-' : '+'}</div>
                </div>
                <div className={classNames(styles.measurementBody, !isExpanded && styles.closed)}>
                    {Object.entries(others)
                        .filter(([key, val]) => !['id', 'deviceId'].includes(key))
                        .map(renderEntry)}
                </div>
            </div>
        )
    }

    const [lastMeasurement] = measurements;

    return (
        <div className={classNames(styles.container, device && styles.active, !isOpen && styles.closed)}>
        <div className={styles.minimize}>{device ? device.name : null}</div>
            <div className={styles.heading}>Last measurement</div>
            {lastMeasurement && renderMeasurement({...lastMeasurement, alwaysExpanded: true}, 0)}
            <div className={styles.heading}>All Measurements</div>
            {measurements.length === 0
                ? <div className={styles.card}>Loading measurements...</div>
                : (
                    measurements.map(renderMeasurement)
                )}
        </div>
    )

}