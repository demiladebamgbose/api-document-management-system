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

describe('Role', () => {
  'use strict';

  it('creates a new role', (done) => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .send({
      title: 'TestRole'
    }).end((err, res) => {
      expect(res.body.title).to.be.equal('TestRole');
      api.get('/api/roles')
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((error, response) => {
        expect(response.body.length).to.be.equal(4);
        done();
      });
    });
  });

  it('should not create a role without a title ', () => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .send({
      title: ''
    }).end((err, res) => {
      expect(res.status).to.be.equal(422);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('Title feild cannot be empty');
    });
  });

  it('should not create another role with the same', () => {
    api.post('/api/roles')
    .set('Accept', 'application/json')
    .send({
      title: 'TestRole'
    }).end((err, res) => {
      expect(res.status).to.be.equal(422);
      expect(res.body.success).to.be.equal(false);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.equal('role title already exists');
    });
  });

  it('should delete a role from the database', (done) => {
    api.delete('/api/roles/1')
     .set('Accept', 'application/json')
     .set('x-access-token', token)
     .end((err, res) => {
       expect(res.body).to.be.equal(1);
       done();
     });
  });

  it('get all roles from the database', (done) => {
    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(Array.isArray(res.body)).to.be.equal(true);
      expect(res.body.length).to.be.equal(3);
      done();
    });
  });

  it('should have titles for all roles', (done) => {

    const checkProperty = (array, propertyName) => {
      array.forEach((item) => {
        expect(item).to.have.property(propertyName);
        expect(item[propertyName]).to.not.equal('');
      });
    };

    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(Array.isArray(res.body)).to.equal(true);
      checkProperty(res.body, 'title');
      done();
    });
  });

  it('should have unique titles for all roles', (done) => {

    const checkUniqueTitle = (rolesArray) => {
      let titles = [];
      rolesArray.forEach((role) => {
        expect(titles.indexOf(role.title)).to.equal(-1);
        titles.push(role.title);
      });
    };

    api.get('/api/roles')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      checkUniqueTitle(res.body);
      done();
    });
  });

  it('should retrieve a role based on params.id', (done) => {
    api.get('/api/roles/3')
    .set('Accept', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      expect(typeof(res.body)).to.equal('object');
      expect(res.body).to.have.property('title');
      expect(res.body.title).to.be.equal('Admin');
      done();
    });
  });
});
