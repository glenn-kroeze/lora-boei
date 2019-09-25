import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL
});

api.interceptors.response.use(
    res => res.data,
    res => res.data
)

export const getDevices = async () =>
    api.get('/devices')
        .then(devices => devices.map(d => ({...d, location: JSON.parse(d.location)})));

export const getMeasurements = async id => api.get(`/measurements?deviceId=${id}`)