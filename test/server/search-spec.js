var should = require('chai').should(),
  expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest'),
  api = supertest(express);

var jwt = require('jsonwebtoken');
var secret = require('./../../config/config').secret;
var token = jwt.sign({
  emailaddress: 'demilade@gmail.com',
  password: '12345678',
  RoleId: 2,
  OwnerId: 2
}, secret, {
  expiresIn: 60*60*24
});


describe('Search', function () {

  var yesterday ;
  it('should return all documents with a specified role', function (done) {

    function checkRoles (array) {
      for (var i = 0; i < array.length; i++) {
        expect(array[i].RoleId).to.equal(2);
      }
    }

    api.get('/api/documents?limit=5&page=1&RoleId=2')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.at.most(5);
      checkRoles(res.body);
      done();
    });
  });

  it('should get a single document by id', function (done) {
    api.get('/api/documents/3')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.body.title).to.be.equal('Serious document');
      yesterday = res.body.createdAt;
      done();
    });
  });

  it('should return all documets created on a particular date', function (done) {
    api.get('/api/documents?limit=5&page=1&date=' + yesterday)
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.body.length).to.be.equal(2);
      expect(res.body.length).to.be.at.most(5);
      done();
    });
  });
});
