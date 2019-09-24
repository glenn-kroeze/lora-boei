const { Model } = require('objection');
const  Measurement  = require('./Measurement');

class Device extends Model {
    static get tableName() {
        return 'devices';
    }

    static get relationMappings() {
        return {
            measurements: {
                relation: Model.HasManyRelation,
                modelClass: Measurement,
                join: {
                    from: 'devices.id',
                    to: 'measurements.deviceId'
                }
            }
        };
    }
}

module.exports = Device;