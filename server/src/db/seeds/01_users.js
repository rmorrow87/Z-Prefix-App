const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  const hashedPassword = await bcrypt.hash('password123', 10);
  return knex('users').insert([
    {first_name: 'John', last_name: 'Doe', username: 'johndoe', password: hashedPassword},
    {first_name: 'Jane', last_name: 'Smith', username: 'janesmith', password: hashedPassword}
  ]);
};
