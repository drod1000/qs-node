const chai = require('chai');
const app = require('../server');
const request = require('request');
const Food = require('../lib/models/food');

describe('Server', () => {
  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, res) => {
      if(err) {
        done(err);
      }
    })
    done();

    this.request = request.defaults ({
      baseUrl: 'http://localhost:9876'
    })
  })

  after(() => {
    this.server.close();
  })

  it('should exist', () => {
    chai.assert(app);
  })

  describe('POST /api/foods', () => {
    beforeEach((done) => {
      Food.clearFoods().then(() => done());
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })

    it('should return a 422 if request body is empty', (done) => {
      this.request.post('/api/foods', (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 422);
        done();
      })
    })

    it('should receive and store data', (done) => {
      const food = { name: 'Apple', calories: '60'};

      this.request.post('/api/foods', {form: food}, (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 201);
        done();
      })
    })
  })

  describe('GET /api/foods', () => {
    beforeEach((done) => {
      Food.createFood('Apple', 60)
      .then(() => Food.createFood('Banana', 120))
      .then(() => done())
      .catch(done);
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })

    it('can return all foods', (done) => {
      this.request.get('/api/foods', (err, res) => {
        if(err) {
          done(err);
        }
        chai.assert.equal(res.statusCode, 200);

        let parsedFoods = JSON.parse(res.body);

        chai.assert.equal(parsedFoods[0].name, 'Apple');
        chai.assert.equal(parsedFoods[0].calories, 60);
        chai.assert.equal(parsedFoods[1].name, 'Banana');
        chai.assert.equal(parsedFoods[1].calories, 120);
      })
    })
  })

  describe('GET /api/foods/:id', () => {
    beforeEach((done) => {
      Food.createFood('Apple', 60).then(() => done())
      .catch(done);
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })

    it('should return a 404 if the food is not found', (done) => {
      this.request.get('/api/foods/2', (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 404);
        done();
      })
    })

    it('should return the corresponding food if there is a match', (done) => {
      this.request.get('/api/foods/1', (err, res) => {
        if(err) {
          done(err);
        }
        const id = 1;
        const name = 'Apple';
        const calories = 60;

        let parsedFood = JSON.parse(res.body);

        chai.assert.equal(res.statusCode, 200);
        chai.assert.equal(parsedFood.id, id);
        chai.assert.equal(parsedFood.name, name);
        chai.assert.equal(parsedFood.calories, calories);
        done();
      })
    })
  })

  describe('PUT /api/foods/:id', () => {
    beforeEach((done) => {
      Food.createFood('Apple', 60).then(() => done())
      .catch(done);
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })

    it('should return a 422 if request body is empty', (done) => {
      this.request.put('/api/foods/1', (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 422);
        done();
      })
    })

    it('should return a 404 if the food is not found', (done) => {
      const food = {name: 'Yogurt', calories: '60'};

      this.request.put('/api/foods/2', {form: food}, (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 404);
        done();
      })
    })

    it('should return a 204 if the corresponding food was updated sucessfully', (done) => {
      const food = {name: 'Yogurt', calories: '60'};

      this.request.put('/api/foods/1', {form: food}, (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 204);
        done();
      })
    })
  })

  describe('DELETE /api/foods/:id', () => {
    beforeEach((done) => {
      Food.createFood('Apple', 60).then(() => done())
      .catch(done);
    })

    afterEach((done) => {
      Food.clearFoods().then(() => done());
    })

    it('should return a 404 if the food is not found', (done) => {
      this.request.delete('/api/foods/2', (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 404);
        done();
      })
    })

    it('should delete the corresponding food if there is a match', (done) => {
      this.request.delete('/api/foods/1', (err, res) => {
        if(err) {
          done(err);
        }

        chai.assert.equal(res.statusCode, 200);
        done();
      })
    })
  })
})
