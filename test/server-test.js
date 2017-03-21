const chai = require('chai');
const app = require('../server');
const request = require('request');

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

  describe('GET /api/foods/:id', () => {
    beforeEach(() => {
      app.locals.foods = [
        { id: 1, name: 'Apple', calories: 60},
        { id: 2, name: 'Banana', calories: 120}
      ]
    })
    it('should return a 404 is the food is not found', (done) => {
      this.request.get('/api/foods/3', (err, res) => {
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

        chai.assert.equal(res.statusCode, 200);
        chai.assert.include(res.body, 'Apple');
        chai.assert.include(res.body, 60);
        done();
      })
    })
  })
})
