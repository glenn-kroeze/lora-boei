
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('devices', table => {
            table.increments('id').primary();
            table.string('deviceEui');
            table.string('name');
            table.json('location');
            table.dateTime('createdAt');
            table.dateTime('lastSeen');
        })
    ])
};

exports.down = function(knex) {
  return Promise.all([
      knex.schema.dropTable('devices')
  ])
};
