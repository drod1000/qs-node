const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/foods/:id', (req, res) => {
  const id = req.params.id;
  const food = searchByID(id, app.locals.foods);

  if(!food) {
    return res.sendStatus(404);
  }
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

function searchByID(id, array) {
  for(var i = 0; i < array.length; i++) {
    var currentFood = array[i];
    if(currentFood["id"] == id) {
      return currentFood;
    }
  }
}
