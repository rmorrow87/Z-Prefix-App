exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('items').del()

  // Inserts seed entries
  return knex('items').insert([
    {user_id: 1, item_name: 'CAC', description: 'Common Access Card', quantity: 1},
    {user_id: 1, item_name: 'Dog Tags', description: 'Military issue tags', quantity: 2},
    {user_id: 2, item_name: 'Will to live', description: 'Probably good to have', quantity: 10}
  ]);
};