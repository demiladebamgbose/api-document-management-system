import 'babel-polyfill';
import { expect } from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import express from '../../main';

const api = supertest(express);
const secret = process.env.secret;

const adminToken = jwt.sign({
  emailAddress: '123@abc.com',
  password: '12345',
  RoleId: 3,
  OwnerId: 3
}, secret, {
  expiresIn: 60 * 60 * 24
});

const nonAdminToken = jwt.sign({
  emailAddress: 'notandmin@abc.com',
  password: '123456',
  RoleId: 5,
  OwnerId: 4
}, secret, {
  expiresIn: 60 * 60 * 24
});

describe('Role', () => {
  it('creates a new role', (done) => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', adminToken)
    .send({
      title: 'TestRole'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body.title).to.be.equal('TestRole');
      api.get('/api/roles')
      .set('Accept', 'application/json')
      .set('x-access-token', adminToken)
      .end((error, response) => {
        expect(response.body.length).to.be.equal(4);
        done();
      });
    });
  });

  it('should not create a role without a title ', () => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', adminToken)
    .send({
      title: ''
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Title field cannot be empty');
    });
  });

  it('should not create another role with the same title', () => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', adminToken)
    .send({
      title: 'TestRole'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(409);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('role title already exists');
    });
  });

  it('should not allow non admin users to create roles', (done) => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', nonAdminToken)
    .send({
      title: 'ANewRole'
    })
    .end((err, res) => {
      expect(res.status).to.be.equal(403);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be
      .equal('Admin role needed to access resource');
      done();
    });
  });

  it('should update a role in the database', (done) => {
    api.put('/api/roles/1')
     .set('Accept', 'application/json')
     .set('x-access-token', adminToken)
     .send({
       title: 'Role'
     })
     .end((err, res) => {
       expect(res.status).to.be.equal(201);
       expect(res.body.title).to.be.equal('Role');
       done();
     });
  });

  it('should delete a role from the database', (done) => {
    api.delete('/api/roles/1')
     .set('Accept', 'application/json')
     .set('x-access-token', adminToken)
     .end((err, res) => {
       expect(res.body).to.be.equal(1);
       done();
     });
  });

  it('get all roles from the database', (done) => {
    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', adminToken)
    .end((err, res) => {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.equal(3);
      done();
    });
  });


  it('should retrieve a role based on params.id', (done) => {
    api.get('/api/roles/3')
    .set('Accept', 'application/json')
    .set('x-access-token', adminToken)
    .end((err, res) => {
      expect(typeof (res.body)).to.equal('object');
      expect(res.body).to.have.property('title');
      expect(res.body.title).to.be.equal('Admin');
      done();
    });
  });
});
