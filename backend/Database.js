const Knex = require('knex');
const { Model } = require('objection');

const knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './example.db'
    }
});

class Database {
    constructor() {
        Model.knex(knex);
    }

    async createSchema() {
        if (await knex.schema.hasTable('devices')) {
            return;
        }

        await knex.schema.createTable('devices', table => {
            table.increments('id').primary();
            table.string('name');
            table.json('location');
            table.dateTime('createdAt');
            table.dateTime('lastSeen');
        });

        await knex.schema.createTable('measurements', table => {
            table.integer('deviceId').references('devices.id');
            table.float('waterTemperature');
            table.float('airTemperature');
            table.date('timestamp');
        })
    }

    initialize() {
        return this.createSchema();
    }

}

module.exports = Database;