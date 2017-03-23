const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

function clearFoods() {
  return database.raw('TRUNCATE foods RESTART IDENTITY')
}

function createFood(food, calories) {
  return database.raw(
    'INSERT INTO foods (name, calories) VALUES (?, ?)',
    [ food, calories ]
  )
}

module.exports = {
  clearFoods: clearFoods,
  createFood, createFood
}
