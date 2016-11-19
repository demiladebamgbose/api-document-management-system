import 'babel-polyfill'
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
  OwnerId: 4
}, secret, {
  expiresIn: 60 * 60 * 24
});

const nonAdminToken = jwt.sign({
  emailAddress: '123@abc.com',
  password: '12345',
  RoleId: 4,
  OwnerId: 3
}, secret, {
  expiresIn: 60 * 60 * 24
});

const testUser = {
  username: 'lade',
  emailAddress: 'lade@gmail.com',
  password: '12345678',
  firstName: 'demilade',
  lastName: 'bamgbose'
};

describe('User', () => {
  it('should create a new user', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send(testUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.ok;
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not create the same user twice', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send(testUser)
      .end((err, res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body.success).to.be.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('user already exists');
        done();
      });
  });

  it('should not create a user with incomplete data fields', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailAddress: 'lade22@gmail.com',
        password: '',
        firstName: 'demilade',
        lastName: ''
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Missing fields. Fields cannot be empty');
        done();
      });
  });

  it('should not create a user with invalid names', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailAddress: 'lade22@gmail.com',
        password: '12345678',
        firstName: 'd.!emiladf753e',
        lastName: 'b355@$#amgbs'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Invalid First name or Last name');
        done();
      });
  });

  it('should not create user with invalid emailAddress', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailAddress: 'lade22gmailcom',
        password: '12345678',
        firstName: 'Femisola',
        lastName: 'bamgbs'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be
        .equal('Invalid Email Address or Password');
        done();
      });
  });

  it('should login a user', (done) => {
    api.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        emailAddress: 'lade@gmail.com',
        password: '12345678'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.ok;
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not login a user with wrong password', (done) => {
    api.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        emailAddress: 'lade@gmail.com',
        password: 'abcdefgh'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('authentication failed. Wrong password');
        done();
      });
  });

  it('should not login a non existent user', (done) => {
    api.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        emailAddress: 'lade22@gmail.com',
        password: 'abcdefgh'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('authentication failed. User not found');
        done();
      });
  });

  it('non admin user should not delete a user from the database', (done) => {
    api.delete('/api/users/1')
     .set('Accept', 'application/json')
     .set('x-access-token', nonAdminToken)
     .end((err, res) => {
       expect(res.body.success).to.not.be.ok;
       expect(res.body).to.have.property('message');
       expect(res.body.message).to.be
       .equal('You do not have access to delete user');
       done();
     });
  });

  it('should delete a user from the database', (done) => {
    api.delete('/api/users/1')
     .set('Accept', 'application/json')
     .set('x-access-token', adminToken)
     .end((err, res) => {
       expect(res.body).to.be.equal(1);
       done();
     });
  });

  it('should update your user details', (done) => {
    api.put('/api/users/3')
      .set('Accept', 'application/json')
      .set('x-access-token', nonAdminToken)
      .send({
        emailAddress: 'somethingnew@gmail.com'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.ok;
        expect(res.body).to.have.property('user');
        expect(res.body.user.emailAddress).to.be.equal('somethingnew@gmail.com');
        done();
      });
  });

  it('should not update any other user details', (done) => {
    api.put('/api/users/4')
      .set('Accept', 'application/json')
      .set('x-access-token', nonAdminToken)
      .send({
        emailAddress: 'somethingnew@gmail.com'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Oops! user details are not yours to edit');
        done();
      });
  });

  it('should not update details for a non existent user', (done) => {
    api.put('/api/users/8')
      .set('Accept', 'application/json')
      .set('x-access-token', nonAdminToken)
      .send({
        emailAddress: 'somethingnew@gmail.com'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Oops! user details are not yours to edit');
        done();
      });
  });

  const checkProperty = (array, property) => {
    array.forEach((item) => {
      expect(item).to.have.property(property);
      expect(item[property]).to.not.equal('');
    });
  };

  it('should have a defined role for all users', (done) => {
    api.get('/api/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        checkProperty(res.body, 'RoleId');
        done();
      });
  });

  it('should have both first name and last name for all users', (done) => {
    api.get('/api/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        checkProperty(res.body, 'firstName');
        checkProperty(res.body, 'lastName');
        done();
      });
  });

  it('should not return all users for non admin', (done) => {
    api.get('/api/users')
      .set('x-access-token', nonAdminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be
        .equal('Admin role needed to access resource');
        done();
      });
  });

  it('should return all users for admin', (done) => {
    api.get('/api/users')
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(Array.isArray(res.body)).to.be.equal(true);
        expect(res.body.length).to.not.equal(0);
        done();
      });
  });

  it('should get a single user by params.id', (done) => {
    api.get('/api/users/3')
      .set('x-access-token', nonAdminToken)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(typeof (res.body)).to.equal('object');
        expect(res.body).to.have.property('emailAddress');
        expect(res.body).to.have.property('firstName');
        expect(res.body).to.have.property('lastName');
        expect(res.body).to.have.property('RoleId');
        expect(res.body.emailAddress).to.be.equal('somethingnew@gmail.com');
        done();
      });
  });
});
