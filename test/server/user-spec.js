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
  RoleId: 1,
  OwnerId: 3
}, secret, {
  expiresIn: 60*60*24
});

describe('User', () => {

  it('should create a new user', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailaddress: 'lade@gmail.com',
        password: '12345678',
        firstname: 'demilade',
        lastname: 'bamgbose',
        RoleId: 3
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.ok;
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should not create the same user twice', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailaddress: 'lade@gmail.com',
        password: '12345678',
        firstname: 'demilade',
        lastname: 'bamgbose',
        RoleId: 3
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(422);
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
        emailaddress: 'lade22@gmail.com',
        password: '',
        firstname: 'demilade',
        lastname: '',
        RoleId: 3
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body.success).to.be.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Missing fields. Feilds cannot be empty');
        done();
      });
  });

  it('should not create a user assigned to a non existent role', (done) => {
    api.post('/api/users')
      .set('Accept', 'application/json')
      .send({
        username: 'lade',
        emailaddress: 'lade22@gmail.com',
        password: '12345678',
        firstname: 'demilade',
        lastname: 'bamgbs',
        RoleId: 7
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body.success).to.be.equal(false);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Invalid Role for user');
        done();
      });
  });

  it('should login a user', (done) => {
    api.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        emailaddress: 'lade@gmail.com',
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
        emailaddress: 'lade@gmail.com',
        password: 'abcdefgh'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('authentication failed. Wrong password');
        done();
      });
  });

  it('should not login a user with wrong password', (done) => {
    api.post('/api/users/login')
      .set('Accept', 'application/json')
      .send({
        emailaddress: 'lade22@gmail.com',
        password: 'abcdefgh'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('authentication failed. User not found');
        done();
      });
  });

  it('should delete a user from the database', (done) => {
    api.delete('/api/users/1')
     .set('Accept', 'application/json')
     .set('x-access-token', token)
     .end((err, res) => {
       expect(res.body).to.be.equal(1);
       done();
     });
  });

  it('should update your user details', (done) => {
    api.put('/api/users/3')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        emailaddress: 'somethingnew@gmail.com'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.ok;
        expect(res.body).to.have.property('user');
        expect(res.body.user.emailaddress).to.be.equal('somethingnew@gmail.com');
        done();
      });
  });

  it('should not update any other user details', (done) => {
    api.put('/api/users/4')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .send({
        emailaddress: 'somethingnew@gmail.com'
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
      .set('x-access-token', token)
      .send({
        emailaddress: 'somethingnew@gmail.com'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.not.be.ok;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('Oops! user details are not yours to edit');
        done();
      });
  });

  it('each user should be unique', (done) => {
    const uniqueUser = (userArray) => {
      let emailaddress = [];
      userArray.forEach((user) => {
        expect(emailaddress.indexOf(user.emailaddress)).to.equal(-1);
        emailaddress.push(user.emailaddress);
      });
    };

    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        uniqueUser(res.body);
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
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        checkProperty(res.body, 'RoleId');
        done();
      });
  });

  it('should have both first name and last name for all users', (done) => {
    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        checkProperty(res.body, 'firstname');
        checkProperty(res.body, 'lastname');
        done();
      });
  });

  it('should return all users', (done) => {
    api.get('/api/users')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(Array.isArray(res.body)).to.be.equal(true);
        expect(res.body.length).to.not.equal(0);
        done();
      });
  });

  it('should get a single user by params.id', (done) => {
    api.get('/api/users/4')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(typeof(res.body)).to.equal('object');
        expect(res.body).to.have.property('emailaddress');
        expect(res.body).to.have.property('firstname');
        expect(res.body).to.have.property('lastname');
        expect(res.body).to.have.property('RoleId');
        expect(res.body.emailaddress).to.be.equal('winner@gmail.com');
        done();
      });
  });
});
