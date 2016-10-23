var expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest'),
  api = supertest(express);

var jwt = require('jsonwebtoken');
var secret = require('./../../config/config').secret;
var token = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 3,
  OwnerId: 2
}, secret, {
  expiresIn: 60*60*24
});

describe('Role', function () {

  it ('creates a new role',function (done) {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .send({
      title: 'TestRole'
    }).end(function (err, res) {
      expect(res.body.title).to.be.equal('TestRole');
      api.get('/api/roles')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end( function (error, response) {
        expect(response.body.length).to.be.equal(4);
      });
    });
    done();
  });

  afterEach(function (done) {
    api.delete('/api/roles/1')
     .set('Accept', 'application/json')
     .set('x-access-token', token);
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
    .set('x-access-token', token)
    .end(function (err, res) {
      expect(Array.isArray(res.body)).to.be.equal(true);
      checkProperty(res.body, 'id');
      checkProperty(res.body, 'title');
      done();
    });
  });

  it('should have unique titles for each role', function (done) {

    function checkUniqueTitle (rolesArray) {
      var titles = [];
      for (var i = 0; i < rolesArray.length; i++) {
        expect(titles.indexOf(rolesArray[i].title)).to.equal(-1);
        titles.push(rolesArray[i].title);
      }
    }

    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end(function (err, res) {
      checkUniqueTitle(res.body);
      done();
    });
  });
});
