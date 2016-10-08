var should = require('chai').should(),
  expect = require('chai').expect,
  supertest = require('supertest');
  api = supertest('http://localhost:8080');
  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGFkZHJlc3MiOiJ0ZXN0QHRlc3RzLmNvbSIsInBhc3N3b3JkIjoiMTIzNCIsImlhdCI6MTQ3NTg4OTM1OSwiZXhwIjoxNDc1OTc1NzU5fQ.recq-HO2eACHGMkJm2rWvFswof2A337wNDnQZllNLTE';


describe('Role', function () {

  beforeEach(function (done) {
    api.post('/api/create/role')
    .set('Accept', 'application/json')
    .send({
      title: 'Test Role'
    });
    done();
  });

  it('should return 200', function (done) {
    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end(function (err, res) {
      expect(Array.isArray(res.body)).to.be.equal(true);
      done();
    });
  });

  it('should return an array of roles', function (done) {

    function checkProperty(array, propertyName) {
      for (var i = 0; i < array.length; i++){
        expect(array[i]).to.have.property(propertyName);
        expect(array[i][propertyName]).to.not.equal('');
      }
    }

    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token',token)
    .end(function (err, res) {
      expect(Array.isArray(res.body)).to.be.equal(true);
      checkProperty(res.body, 'id');
      checkProperty(res.body, 'title');
      done();
    });
  });

  it('should have unique titles for each role', function (done) {
    api.post('/api/create/role')
    .set('Accept', 'application/json')
    .send({
      title: 'Test Role'
    }).end(function (err, res) {
      expect(res.body.message).to.be.equal('role title already exists');
      done();
    });
  });
});
