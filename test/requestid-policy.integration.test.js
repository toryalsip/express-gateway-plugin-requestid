// Vslidates that the policy correctly wires up to the express-gateway server and performs
// the correct actions.  This test requires first running "node test-server/server.js" first
// before these tests can pass.  This is a task that should be automated, but currently 
// the implementation of express-gateay doesn't include testing tools.

const express = require('express');
const supertest = require('supertest');
const request = supertest('http://localhost:8080');
const chai = require('chai');
const should = chai.should();

let server = undefined;

describe('requestid-policy integration', function () {
  before(function (done) {
    const app = express();
    const checkHeader = (req, res) => {
      if (req.headers['x-gateway-request-id']) {
        res.status(200).send('OK');
      } else {
        res.status(400).send('Invalid');
      }
    };

    app.get('/api/v1/*', checkHeader);

    server = app.listen(8081, done());
  });

  after(function () {
    server.close();
  })

  it('should add request id to the request and response', function () {
    return request
      .get('/api/v1/test')
      .expect(200)
      .expect((res) => res.headers.should.have.property('x-gateway-request-id'))
  });
})