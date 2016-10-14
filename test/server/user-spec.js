var should = require('chai').should(),
  expect = require('chai').expect,
  express = require('../../index'),
  supertest = require('supertest'),
  api = supertest(express);

describe('User', function () {
  it('should create a new user on sign up', function (done){
    api.post('/api/signup')
    .set('Accept', 'application/json')
    .send({
      email: 'test@tester.com',
      firstname: 'test',
      lastname: 'tester',
      username: 'testee',
      password: '12345678',
      RoleId: 1
    });
    done();
  });

  it('should pass this', function () {
    expect (true).to.be.equal(true);
  });
});
