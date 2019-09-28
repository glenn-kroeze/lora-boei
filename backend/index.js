const express = require('express');
const cors = require('cors');
const app = express();
const provisionDatabase = require('./testing/provisionDatabase');

app.use(cors());

const PORT = process.env.PORT || 4000;

const { Device, Measurement } = require('./models');

app.get('/api/devices', async (req, res) => {
  const devices = await Device.query()
    .orderBy('id');
  res.send(devices);
});

app.get('/api/measurements', async (req, res) => {
  const id = req.query.deviceId;
  const measurements = await Measurement.query()
    .where({deviceId: id});
    res.send(measurements);
})

const Database = require('./Database');
const database = new Database();

database.initialize()
  .then(() => provisionDatabase())
  .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
  .catch(err => {
    console.error(err);
    return knex.destroy();
  });
