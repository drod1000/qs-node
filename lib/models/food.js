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

function findFoodByID(id) {
  return database.raw('SELECT * FROM foods WHERE id=?', id)
}

function updateFood(id, name, calories) {
  return database.raw(`UPDATE foods SET name = ?, calories = ? WHERE id = ?`,
  [name, calories, id])
}

function deleteFood(id) {
  return database.raw('DELETE FROM foods WHERE id=?', id)
}

function allFoods() {
  return database.raw('SELECT * FROM foods')
}

module.exports = {
  clearFoods: clearFoods,
  createFood, createFood,
  findFoodByID: findFoodByID,
  updateFood: updateFood,
  deleteFood: deleteFood,
  allFoods: allFoods
}
