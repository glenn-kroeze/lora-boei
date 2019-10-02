
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('devices').del()
    .then(function () {
      // Inserts seed entries
      return knex('devices').insert([
        {
          id: 1, 
          deviceEui: '0004A30B00207A44', 
          name: 'Jimmy', 
          location: JSON.stringify({lat: 51.9169688, lng: 4.4838841}), 
          createdAt: new Date().toISOString(), 
          lastSeen: null
        },

        {
          id: 2, 
          deviceEui: '0004A30B0021188F', 
          name: 'Timmy', 
          location: JSON.stringify({lat: 51.9004892, lng: 4.419557}), 
          createdAt: new Date().toISOString(), 
          lastSeen: null
        },

        {
          id: 3, 
          deviceEui: '0004A30B0020695C', 
          name: 'Limmy', 
          location: JSON.stringify({lat: 51.8960132, lng: 4.4776482}), 
          createdAt: new Date().toISOString(), 
          lastSeen: null
        },

        {
          id: 4, 
          deviceEui: '0004A30B0020F9E6', 
          name: 'Simmy', 
          location: JSON.stringify({lat: 51.9159149, lng: 4.5035956}), 
          createdAt: new Date().toISOString(), 
          lastSeen: null
        },
      ]);
    });
};
