const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.locals.foods = {
  1: { name: 'Apple', calories: 60},
  2: { name: 'Banana', calories: 120}
}

app.get('/api/foods/:id', (req, res) => {
  const id = req.params.id;
  const food = app.locals.foods[id];

  res.status(200).json({
    food
  })
})

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Running on ${app.get('port')}.`);
  })
}

module.exports = app;
