const { Device } = require('../models');

module.exports = async () => {
    const device1 = await Device.query().insertGraph({
        name: 'Jimmy',
        location: JSON.stringify({lat: 51.9169688, lng: 4.4838841}),
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),

        measurements: [
            {
                waterTemperature: 12.5,
                airTemperature: 22.3,
                timeStamp: new Date().toISOString()
            },
            {
                waterTemperature: 12.5,
                airTemperature: 22.3,
                timeStamp: new Date().toISOString()
            },
        ]
      });

      const device2 = await Device.query().insertGraph({
        name: 'Tom',
        location: JSON.stringify({lat: 51.9004892, lng: 4.419557}),
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),

        measurements: [
            {
                waterTemperature: 12.5,
                airTemperature: 22.3,
                timeStamp: new Date().toISOString()
            },
            {
                waterTemperature: 12.5,
                airTemperature: 22.3,
                timeStamp: new Date().toISOString()
            },
        ]
      });

      const device1 = await Device.query().insertGraph({
        name: 'Kees',
        location: JSON.stringify({lat: 51.8960132, lng: 4.4776482}),
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),

        measurements: [
            {
                waterTemperature: 12.5,
                airTemperature: 22.3,
                timeStamp: new Date().toISOString()
            },
            {
                waterTemperature: 12.5,
                airTemperature: 22.3,
                timeStamp: new Date().toISOString()
            },
        ]
      });
}