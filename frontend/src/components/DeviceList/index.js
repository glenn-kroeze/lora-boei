import React, { useState, useEffect } from 'react';
import humanDate from 'human-date';
import classNames from 'classnames';
import styles from './styles.scss';

const getHumanTimeDelta = when => when
    ? humanDate.relativeTime(when)
    : 'Never'

const Filter = ({ value, onChange }) => (
    <input
        className={styles.input}
        placeholder="Filter devices..."
        value={value}
        onChange={e => onChange(e.target.value)}
    />
)

const Device = ({ id, name, lastSeen, selected, onSelect}) => (
    <div
        className={classNames(styles.device, selected && styles.active)}
        onClick={() => onSelect(id)}
    >
        <div className={styles.meta}>
            <div className={styles.name}>{`${name} (${id})`}</div>
            <div className={styles.lastSeen}>{`Last seen: ${getHumanTimeDelta(lastSeen)}`}</div>
        </div>
    </div>
)

export default ({ devices, selectedDeviceId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if(selectedDeviceId) {
            setIsOpen(true);
        }
    }, [selectedDeviceId]);

    return (
        <div className={classNames(styles.container, !isOpen && styles.closed)}>
            <div className={styles.minimize} onClick={() => setIsOpen(!isOpen)}>{isOpen ? '-' : '+'}</div>
            <Filter value={filter} onChange={setFilter} />
            {devices
                .filter(d => filter
                    ? Object.values(d).some(val => String(val).toLowerCase().includes(filter.toLowerCase()))
                    : true
                )
                .map(d => <Device key={d.id} {...d} selected={selectedDeviceId === d.id} onSelect={onSelect} />)}
        </div>
    )
}