var should = require('chai').should(),
  expect = require('chai').expect,
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
  // after(function (done) {
  //   api.get('/api/users/4')
  //     .set('x-access-token', token)
  //     .set('Accept', 'application/json')
  //     .end(function (err, res) {
  //
  //     });
  //   done();
  // });

  it('should create a new user', function (done) {
    api.get('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailaddress: 'lade@gmail.com',
        password: '12345678',
        firstname: 'demilade',
        lastname: 'bamgbose',
        RoleId: 2
      })
      .end(function (err, res) {
        expect(res.body).to.have.property('token');
      });
    done();
  });

  it('should login a user', function (done) {
    
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
        expect(Array.lenght(res.body)).to.not.equal(0);
      });
    done();
  });
});
