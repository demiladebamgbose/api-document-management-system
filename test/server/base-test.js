var should = require('chai').should(),
  expect = require('chai').expect,
  supertest = require('supertest');

describe('base-test', function () {
  it('should pass', function (done) {
    expect(true).to.be.equal(true);
    done();
  });
});
