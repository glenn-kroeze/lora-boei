import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default ({ devices, selectedDeviceId, onSelect }) => {
    const [filter, setFilter] = useState('');


    const Filter = ({ value, onChange }) => (
        <input
            className={styles.input}
            placeholder="Filter devices..."
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    )

    const Device = ({ id, name, lastSeen }) => (
        <div
            className={classNames(styles.device, id === selectedDeviceId && styles.active)}
            onClick={() => onSelect(id)}
        >
            <div className={styles.meta}>
                <div className={styles.name}>{`${name} (${id})`}</div>
                <div className={styles.lastSeen}>{`Last seen: ${lastSeen}`}</div>
            </div>
        </div>
    )

    return (
        <div className={styles.container}>
            <Filter value={filter} onChange={setFilter} />
            {devices
                .filter(d => filter ? Object.values(d).some(val => String(val).toLowerCase().includes(filter.toLowerCase())) : true)
                .map(d => <Device key={d.id} {...d} />)}
        </div>
    )
}