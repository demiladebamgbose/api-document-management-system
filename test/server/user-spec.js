var expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest'),
  api = supertest(express);

var jwt = require('jsonwebtoken');
var secret = require('./../../config/config').secret;
var token = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 1
}, secret, {
  expiresIn: 60*60*24
});

describe('User', function () {

  it('should create a new user', function (done) {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailaddress: 'lade@gmail.com',
        password: '12345678',
        firstname: 'demilade',
        lastname: 'bamgbose',
        RoleId: 2,
        OwnerId:2
      })
      .end(function (err, res) {
        expect(res.body).to.have.property('token');
      });
    done();
  });

  it('should login a user', function (done) {
    api.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        emailaddress: 'lade@gmail.com',
        password: '12345678'
      })
      .end(function (err, res) {
        expect(res.body).to.have.property('token');
      });
    done();
  });

  after(function (done) {
    api.delete('/api/users/1')
      .set('x-access-token', token)
      .set('Accept', 'application/json');
    done();
  });

  it('each user should be unique', function (done) {

    function uniqueUser (userArray) {
      var emailaddress = [];
      for (var i = 0; i < userArray.length; i++) {
        expect(emailaddress.indexOf(userArray[i].emailaddress)).to.equal(-1);
        emailaddress.push(userArray[i].emailaddress);
      }
    }

    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        uniqueUser(res.body);
      });
    done();
  });

  function checkProperty (array, property) {
    for (var i = 0; i < array.length; i++) {
      expect(array[i]).to.have.property(property);
      expect(array[i][property]).to.not.equal('');
    }
  }

  it('should have a defined role', function (done) {
    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        checkProperty(res.body, 'RoleId');
      });
    done();
  });

  it('should have both first name and last name', function (done) {
    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        checkProperty(res.body, 'firstname');
        checkProperty(res.body, 'lastname');
      });
    done();
  });

  it('should return all users', function (done) {
    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(Array.isArray(res.body)).to.be.equal(true);
        expect(res.body.length).to.not.equal(0);
      });
    done();
  });
});
