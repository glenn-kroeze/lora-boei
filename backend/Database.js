const Knex = require('knex');
const { Model } = require('objection');

const knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: 'example.db'
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
            table.string('location');
        });

        await knex.schema.createTable('measurements', table => {
            table.integer('deviceId').references('devices.id');
            table.date('timestamp');
        })
    }

    initialize() {
        return this.createSchema();
    }

}

module.exports = Database;