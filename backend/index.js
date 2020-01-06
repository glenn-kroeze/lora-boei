//Express webserver
const express = require('express');
const cors = require('cors');
const bodyParser = require('express'); 
const app = express();

app.use(cors());
app.use(bodyParser.json())

const router = express.Router();
const PORT = process.env.PORT || 4000;

router.get('/devices', async (req, res) => {
  const devices = await Device.query()
    .orderBy('id');
  res.send(devices);
});

router.get('/measurements', async (req, res) => {
  const id = req.query.deviceId;
  const measurements = await Measurement.query()
    .where({deviceId: id})
    .orderBy('timestamp', 'desc');
    res.send(measurements);
});

router.post('/measurements', async (req, res) => {
  const {hardware_serial, payload_fields, metadata: {time}} = req.body;
  const {
    temperature_1, //Water temp
    temperature_2, //Air temp
    analog_in_1, //pH sensor reading
    analog_in_2, //???
  } = payload_fields;

  const phValue = (674.4 - (analog_in_1 * 10)) / -15.655;

  console.log(`Inserting measurement at ${Date().now().toISOString()}`, {temperature_1, temperature_2, phValue, analog_in_2})

  const device = await Device.query().findOne({deviceEui: hardware_serial});  
  await Measurement.query().insertGraph({
    deviceId: device.id,
    waterTemperature: temperature_1,
    airTemperature: temperature_2,
    salinity: analog_in_2 * 10,
    timestamp: time
  });

  await Device.query()
    .findById(device.id)
    .patch({lastSeen: time})
});

app.use('/api', router);
app.use('/', express.static(__dirname + '/app'))

//Objection and knex, my babies
const Knex = require('knex');
const { Model } = require('objection');
const { Device, Measurement } = require('./models');

const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
      filename: './database.db'
  }
});

Model.knex(knex);

knex.migrate.latest()
  .then(() => knex.seed.run())
  .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)));
