import React, { useState, useEffect } from 'react';
import { getMeasurements } from '../../api';
import classNames from 'classnames';
import styles from './styles.scss';

const convert = value => ({
    number: value,
    string: value,
    object: JSON.stringify(value),
    object: JSON.stringify(value)
}[typeof value])

export default ({ devices, selectedDeviceId }) => {
    const [measurements, setMeasurements] = useState([]);
    const [expanded, setExpanded] = useState({});

    const device = devices.find(d => d.id === selectedDeviceId) || null;

    useEffect(() => {
        if (selectedDeviceId) {
            getMeasurements(selectedDeviceId).then(setMeasurements);
            setExpanded({});
        }
    }, [selectedDeviceId])

    const renderEntry = ([key, val]) => (
        <div className={styles.entry}>
            <div className={styles.key}>{key}:</div>
            <div className={styles.value}>{convert(val)}</div>
        </div>
    )

    const renderMeasurement = ({timestamp, ...others}, i) => {
        const isExpanded = expanded[i];
        return (
            <div className={styles.measurement}>
                <div className={styles.measurementHeading} onClick={() => setExpanded({ ...expanded, [i]: !isExpanded })}>
                    <div className={styles.timestamp}>{timestamp}</div>
                    <div className={styles.expandButton}>+</div>
                </div>
                <div className={classNames(styles.measurementBody, !isExpanded && styles.closed)}>
                    {Object.entries(others).map(renderEntry)}
                </div>
            </div>
        )
    }

    return (
        <div className={classNames(styles.container, device && styles.active)}>
            <div className={styles.heading}>Metadata</div>
            {device && Object.entries(device).map(renderEntry)}
            <div className={styles.heading}>Measurements</div>
            {measurements.length === 0
                ? <div className={styles.card}>Loading measurements...</div>
                : (
                    measurements.map(renderMeasurement)
                )}
        </div>
    )

}