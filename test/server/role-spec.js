var should = require('chai').should(),
  expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest');
  api = supertest(express);
  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGFkZHJlc3MiOiJ0ZXN0QHRlc3RzLmNvbSIsInBhc3N3b3JkIjoiMTIzNCIsImlhdCI6MTQ3NjAyMzIxMiwiZXhwIjoxNDc2MTA5NjEyfQ.b9T5j5dCI0jO1PPAY1X475E5XZSUdZ2LoAEl4juQ75E';


describe('Role', function () {

  beforeEach(function (done) {
    api.post('/api/create/role')
    .set('Accept', 'application/json')
    .send({
      title: 'TestRole'
    });
    done();
  });

  afterEach(function (done) {
    api.delete('/api/role/TestRole/delete')
    .set('Accept', 'application/json');
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

    function checkUniqueTitle (rolesArray) {
      for (var i = 0; i < rolesArray.length; i++) {
        var titles = [];
        expect(titles.indexOf(rolesArray[i].title)).to.equal(-1);
        titles.push(rolesArray[i].title);
      }
    }

    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token',token)
    .end(function (err, res) {
      checkUniqueTitle(res.body);
      done();
    });
  });
});
