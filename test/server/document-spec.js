var expect = require('chai').expect,
  express = require('../../main'),
  supertest = require('supertest'),
  api = supertest(express),
  jwt = require('jsonwebtoken'),
  secret = require('./../../config/config').secret;

var token = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 1,
  OwnerId: 3
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

  it('should not create a document with incomplete details', function (done) {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'Test Document',
      content: '',
      RoleId: 3
    })
    .end(function (err, res) {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Feilds cannot be empty');
      done();
    });
  });

  it('should only create a document with a unique title', function (done) {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'Test Document',
      content: 'Test Content for testing sake',
      RoleId: 3
    })
    .end(function (err, res) {
      expect(res.status).to.be.equal(422);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Title already exists');
      done();
    });
  });

  it('should only create a document with a valid role', function (done) {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'New Document',
      content: 'Test Content for testing sake',
      RoleId: 7
    })
    .end(function (err, res) {
      expect(res.status).to.be.equal(422);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Role does not exist');
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

  it('should retrieve a document from the database', function (done) {
    api.get('/api/documents/4')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(typeof(res.body)).to.be.equal('object');
      expect(res.body.title).to.be.equal('Yellow document');
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

  it('should update attributes of a document', function (done) {
    api.put('/api/documents/1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'A new title'
    })
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(typeof(res.body)).to.be.equal('object');
      expect(res.body.title).to.be.equal('A new title');
      done();
    });
  });

  it('should delete a document from the database', function (done) {
    api.delete('/api/documents/1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.equal(1);
      done();
    });
  });
});
