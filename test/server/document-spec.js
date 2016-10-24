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
      expect(res.body.title).to.be.equal('Test Document');
      expect(res.body).have.property('createdAt');
      done();
    });
    api.get('api/documents?limit=20')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.body.lenght).to.be.equal(11);
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
      console.log(res.body)
      checkUniqueTitle(res.body);
    });
    done();
  });

  //it('should return all documents');
});
