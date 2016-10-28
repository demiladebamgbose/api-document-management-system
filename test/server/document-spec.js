var expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest'),
  api = supertest(express);

var jwt = require('jsonwebtoken');
var secret = require('./../../config/config').secret;
var token = jwt.sign({
  emailaddress: 'testuser@abc.com',
  password:'12345678',
  RoleId: 2,
  OwnerId: 4
}, secret, {
  expiresIn: 60*60*24
});

describe('Document', function () {

  it('should create a new document with a defined published date', function (done) {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'Test Document',
      content: 'Test Content for testing sake',
      RoleId: 3
    })
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body.title).to.be.equal('Test Document');
      expect(res.body).have.property('createdAt');
      done();
    });
  });


  it('the length of all documents sould be 11', function (done) {
    api.get('/api/documents?limit=20')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(11);
      expect(res.body.length).to.be.at.most(20);
      done();
    });
  });

  it('Every Document should have a unique title', function (done) {
    function checkUniqueTitle (rolesArray) {
      var titles = [];
      for (var i = 0; i < rolesArray.length; i++) {
        expect(titles.indexOf(rolesArray[i].title)).to.equal(-1);
        titles.push(rolesArray[i].title);
      }
    }

    api.get('/api/documents?limit=20')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.at.most(20);
      checkUniqueTitle(res.body);
      done();
    });
  });

  it('should return limited documents with a set query limit', function (done) {
    api.get('/api/documents?limit=4')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(4);
      expect(res.body.length).to.be.at.most(4);
      done();
    });
  });

  it('should return limited documents with a set query limit and offset',
  function (done) {
    api.get('/api/documents?limit=4&page=2')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(4);
      done();
    });
  });

  it('should return documents starting with the most recently created',
  function (done) {
    api.get('/api/documents?limit=4&page=1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(4);
      expect(res.body[0].title).to.be.equal('Test Document');
      done();
    });
  });
});
