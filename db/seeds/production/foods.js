exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE foods RESTART IDENTITY')
  .then(() => {
    return Promise.all([
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ["Apple", 60]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ["Banana", 120]
      ),
      knex.raw(
        'INSERT INTO foods (name, calories) VALUES (?, ?)',
        ["Yogurt", 100]
      )
    ]);
  });
};
