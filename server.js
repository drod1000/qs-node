const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Food = require('./lib/models/food');
const cors = require('cors')

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

app.post('/api/foods', (req, res) => {
  const name = req.body.name;
  const calories = req.body.calories;

  if(!name || !calories) {
    return res.status(422).send({
      error: 'No message property provided'
    })
  }

  Food.createFood(name, calories)
  .then((data) => {
    if(!data.rowCount == 1) {
      res.status(422).send({
        error: 'Unable to process request'
      })
    }
    res.sendStatus(201);
  })
})

app.get('/api/foods/', (req, res) => {
  Food.allFoods()
  .then((data) => {
    if(!data.rowCount) {
      return res.sendStatus(404);
    }
    res.status(200).json(data.rows);
  })
})

app.get('/api/foods/:id', (req, res) => {
  const id = req.params.id;

  Food.findFoodByID(id)
  .then((data) => {
    if(!data.rowCount) {
      return res.sendStatus(404);
    }
    res.status(200).json(data.rows[0]);
  })
})

app.put('/api/foods/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const calories = req.body.calories;

  if(!name || !calories) {
    return res.sendStatus(422);
  }

  Food.updateFood(id, name, calories)
  .then((data) => {
    if(!data.rowCount) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  })
})

app.delete('/api/foods/:id', (req, res) => {
  const id = req.params.id;

  Food.deleteFood(id)
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
