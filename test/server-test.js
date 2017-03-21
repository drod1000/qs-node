const chai = require('chai');
const app = require('../server');

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
})
