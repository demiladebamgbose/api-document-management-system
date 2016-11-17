'use strict';

const expect = require('chai').expect,
  express = require('../../main'),
  supertest = require('supertest'),
  api = supertest(express),
  jwt = require('jsonwebtoken'),
  secret =  process.env.secret;

const adminToken = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 3,
  OwnerId: 3
}, secret, {
  expiresIn: 60*60*24
});

const nonAdminToken = jwt.sign({
  emailaddress: '123@abc.com',
  password:'12345',
  RoleId: 4,
  OwnerId: 4
}, secret, {
  expiresIn: 60*60*24
});

describe('Search', () => {

  it('should return all documents with a specified role for an admin user',
  (done) => {

    const checkRoles = (array) => {
      array.forEach((item) => {
        expect(item.RoleId).to.equal(4);
      });
    };

    api.get('/api/documents?limit=5&page=1&RoleId=4')
    .set('x-access-token', adminToken)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.at.most(5);
      checkRoles(res.body);
      done();
    });
  });

  it('should return all documents with a specified role for non-Admin users',
  (done) => {

    api.get('/api/documents?limit=20&page=1&RoleId=4')
    .set('x-access-token', nonAdminToken)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.equal(4);
      done();
    });
  });


  it('should return all documets created on a particular date', (done) => {
    const todayDate = new Date().toISOString().slice(0,10);
    api.get('/api/documents?limit=20&page=1&date=' + todayDate)
    .set('x-access-token', adminToken)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.length).to.be.equal(10);
      done();
    });
  });

  it('should return all documets accessible to an admin user ', (done) => {
    api.get('/api/users/4/documents?limit=20&page=1')
    .set('x-access-token', adminToken)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.length).to.be.equal(12);
      done();
    });
  });

  it('should return all documets accessible to a non-admin user ', (done) => {
    api.get('/api/users/4/documents?limit=20&page=1')
    .set('x-access-token', nonAdminToken)
    .set('Accept', 'application/json')
    .end((err, res) => {
      expect(res.body.length).to.be.equal(7);
      done();
    });
  });
});
