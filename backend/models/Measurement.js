const { Model } = require('objection');

class Measurement extends Model {
    static get tableName() {
        return 'measurements';
    }
}

module.exports = Measurement;