const express = require('express');
const app = express();
const PORT = 3000;

const { Device } = require('./models');

app.get('/devices', async (req, res) => {
  const devices = await Device.query()
    .orderBy('id');
  res.send(devices);
});

const Database = require('./Database');
const database = new Database();

database.initialize()
  .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
  .catch(err => {
    console.error(err);
    return knex.destroy();
  });
