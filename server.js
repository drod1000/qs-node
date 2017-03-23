const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.post('/api/foods', (req, res) => {
  const name = req.body.name;
  const calories = req.body.calories;

  if(!name || !calories) {
    return res.status(422).send({
      error: 'No message property provided'
    })
  }

  database.raw('INSERT INTO foods (name, calories) VALUES (?, ?)', [name, calories])
  .then((data) => {
    if(data.rowCount == 1) {
      res.sendStatus(201);
    }
  })
})

app.get('/api/foods/:id', (req, res) => {
  const id = req.params.id;

  database.raw('SELECT * FROM foods WHERE id=?', id)
  .then((data) => {
    if(!data.rowCount) {
      return res.sendStatus(404);
    }
    res.status(200).json(data.rows[0])
  })
})

app.put('/api/foods/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const calories = req.body.calories;

  if(!name || !calories) {
    return res.sendStatus(422);
  }

  database.raw(`UPDATE foods SET name = ?, calories = ? WHERE id = ?`,
  [name, calories, id])
  .then((data) => {
    if(!data.rowCount) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  })
})

app.delete('/api/foods/:id', (req, res) => {
  const id = req.params.id;

  database.raw('DELETE FROM foods WHERE id=?', id)
  .then((data) => {
    if(!data.rowCount) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Running on ${app.get('port')}.`);
  })
}

module.exports = app;

function searchByID(id, array) {
  for(var i = 0; i < array.length; i++) {
    var currentFood = array[i];
    if(currentFood["id"] == id) {
      return currentFood;
    }
  }
}

function deleteByID(id, array) {
  for(var i = 0; i < array.length; i++) {
    var currentFood = array[i];
    if(currentFood["id"] == id) {
      array.splice(i, 1);
      return true;
    }
  }
}

function updateByID(id, array, newFood) {
  for(var i = 0; i < array.length; i++) {
    var currentFood = array[i];
    if(currentFood["id"] == id) {
      array[i] = newFood;
      return true;
    }
  }
}
