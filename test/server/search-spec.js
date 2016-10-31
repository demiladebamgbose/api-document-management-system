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

describe('Search', () => {
  'use strict';
  
  let yesterday;

  it('should return all documents with a specified role', (done) => {

    const checkRoles = (array) => {
      array.forEach((item) => {
        expect(item.RoleId).to.equal(2);
      });
    };

    api.get('/api/documents?limit=5&page=1&RoleId=2')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.at.most(5);
      checkRoles(res.body);
      done();
    });
  });

  it('should get a single document by id', (done) => {
    api.get('/api/documents/3')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.title).to.be.equal('Serious document');
      yesterday = res.body.createdAt;
      done();
    });
  });

  it('should return all documets created on a particular date', (done) => {
    api.get('/api/documents?limit=5&page=1&date=' + yesterday)
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.length).to.be.equal(2);
      expect(res.body.length).to.be.at.most(5);
      done();
    });
  });

  it('should return all documets accessible to a user ', (done) => {
    api.get('/api/users/3/documents?limit=20&page=1')
    .set('x-access-token', token)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.length).to.be.equal(7);
      expect(res.body.length).to.be.at.most(20);
      done();
    });
  });
});
