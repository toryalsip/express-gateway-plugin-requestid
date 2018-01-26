const requestidPolicy = require('../policies/requestid-policy');
const chai = require('chai');
const should = chai.should();

describe('requestid-policy', function () {
  it('should add requestid to req and res with the default name', function () {
    let policy = requestidPolicy.policy({});

    let req = {
      headers: {}
    };

    let res = {
      headers: {},
      setHeader: function(name, value) {
        this.headers[name] = value;
      }
    };

    let nextCalled = false;
    let next = () => nextCalled = true;

    policy(req, res, next);

    req.headers.should.have.property('x-gateway-request-id');
    res.headers.should.have.property('x-gateway-request-id');
    nextCalled.should.be.false;
  });
});