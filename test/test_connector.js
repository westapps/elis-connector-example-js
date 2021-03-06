let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../connector');

chai.use(chaiHttp);
chai.should();

let annotationOk = require('./annotation_ok.json');
let annotationError = require('./annotation_error.json');

describe('connector', () => {
  describe('/validate', () => {
    it('it should not return messages when VAT matches', (done) => {
      chai.request(server)
        .post('/validate')
        .send(annotationOk)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('messages');
          res.body.messages.should.be.empty;
          done();
        });
    });
    it('it should return error messages when VAT matches', (done) => {
      chai.request(server)
        .post('/validate')
        .send(annotationError)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('messages');
          res.body.messages[0].should.deep.equal({id: 123, type: 'error', content: 'Total VAT amount differs from sum of VAT amounts'});
          done();
        });
    });
  });
  describe('/save', () => {
    it('it should returm empty response on save', (done) => {
      chai.request(server)
        .post('/save')
        .send(annotationOk)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.have.property('messages');
          done();
        });
    });
  });
});
