'use strict';

const expect = require('chai').expect,
  express = require('../../main'),
  supertest = require('supertest'),
  api = supertest(express),
  jwt = require('jsonwebtoken'),
  secret =  process.env.secret;

const token = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 4,
  OwnerId: 3
}, secret, {
  expiresIn: 60*60*24
});

const testDocument = {
  title: 'Test Document',
  content: 'Test Content for testing sake',
};

describe('Document', () => {

  it('should create a new document with a defined published date', (done) => {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send(testDocument)
    .end((err, res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body.title).to.be.equal('Test Document');
      expect(res.body).have.property('createdAt');
      done();
    });
  });

  it('should assign default type of public to documents', (done) => {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'Public Document',
      content: 'Que sera sera'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body.title).to.be.equal('Public Document');
      expect(res.body).have.property('type');
      expect(res.body.type).to.equal('public');
      done();
    });
  });


  it('should not create a document with incomplete details', (done) => {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'Test Document',
      content: ''
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Fields cannot be empty');
      done();
    });
  });

  it('should only create a document with a unique title', (done) => {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send(testDocument)
    .end((err, res) => {
      expect(res.status).to.be.equal(409);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Title already exists');
      done();
    });
  });

  it('should create a document with type private', (done) => {
    api.post('/api/documents')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'New Document',
      content: 'Test Content for testing sake',
      type: 'private'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body).have.property('type');
      expect(res.body.type).to.equal('private');
      done();
    });
  });


  it('should retrieve a document from the database', (done) => {
    api.get('/api/documents/4')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(typeof(res.body)).to.be.equal('object');
      expect(res.body.title).to.be.equal('Yellow document');
      done();
    });
  });

  it('should return limited documents with a set query limit', (done) => {
    api.get('/api/documents?limit=4')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.at.most(4);
      done();
    });
  });

  it('should return limited documents with a set query limit and offset',
  (done) => {
    api.get('/api/documents?limit=4&page=2')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.at.most(4);
      done();
    });
  });

  it('should return documents starting with the most recently created',
  (done) => {
    api.get('/api/documents?limit=4&page=1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(4);
      expect(res.body[0].title).to.be.equal('New Document');
      done();
    });
  });

  it('should update attributes of a document', (done) => {
    api.put('/api/documents/1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'A new title'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(201);
      expect(typeof(res.body)).to.be.equal('object');
      expect(res.body.title).to.be.equal('A new title');
      done();
    });
  });

  it('should not update attributes of a non-existent document', (done) => {
    api.put('/api/documents/23')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .send({
      title: 'A new title'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(404);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be
      .equal('Failed to update document. Document does not exist');
      done();
    });
  });

  it('should delete a document from the database', (done) => {
    api.delete('/api/documents/1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.equal(1);
      done();
    });
  });
});
