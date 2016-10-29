var expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest'),
  api = supertest(express),
  jwt = require('jsonwebtoken'),
  secret = require('./../../config/config').secret;

var token = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 3,
  OwnerId: 2
}, secret, {
  expiresIn: 60*60*24
});

describe('Role', function () {

  it('creates a new role',function (done) {
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
        done();
      });
    });
  });

  it('should not create a role without a title ', function () {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .send({
      title: ''
    }).end(function (err, res) {
      expect(res.status).to.be.equal(422);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Title feild cannot be empty');
    });
  });

  it('should not create another role with the same', function () {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .send({
      title: 'TestRole'
    }).end(function (err, res) {
      expect(res.status).to.be.equal(422);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('role title already exists');
    });
  });

  it('should delete a role from the database', function (done) {
    api.delete('/api/roles/1')
     .set('Accept', 'application/json')
     .set('x-access-token', token)
     .end(function (err, res) {
       expect(res.body).to.be.equal(1);
       done();
     });
  });

  it('get all roles from the database', function (done) {
    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end(function (err, res) {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.equal(3);
      done();
    });
  });

  it('should have titles for all roles', function (done) {

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
      expect(Array.isArray(res.body)).to.equal(true);
      checkProperty(res.body, 'title');
      done();
    });
  });

  it('should have unique titles for all roles', function (done) {

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

  it('should retrieve a role based on params.id', function (done) {
    api.get('/api/roles/3')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end(function (err, res) {
      expect(typeof(res.body)).to.equal('object');
      expect(res.body).to.have.property('title');
      expect(res.body.title).to.be.equal('Admin');
      done();
    });
  });
});
