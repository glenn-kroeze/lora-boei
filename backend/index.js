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
    .where({deviceId: id});
    res.send(measurements);
});

router.post('/measurements', async (req, res) => {
  const {hardware_serial, metadata: {time}} = req.body;
  const device = await Device.query().findOne({deviceEui: hardware_serial});  
  await Measurement.query().insertGraph({
    deviceId: device.id,
    //vals here
    timestamp: time
  });

  await Device.query()
    .findById(device.id)
    .patch({lastSeen: time})
});

app.use('/api', router);

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
