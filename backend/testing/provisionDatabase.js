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
}