// Vslidates that the policy correctly wires up to the express-gateway server and performs
// the correct actions.

const child_process = require('child_process');
const express = require('express');
const supertest = require('supertest');
const request = supertest('http://localhost:8080');
const chai = require('chai');
const should = chai.should();

let server = undefined;
let testGw = undefined;

describe('requestid-policy integration', function () {
  before(function (done) {
    this.timeout(10000);
    const app = express();
    const checkHeader = (req, res) => {
      if (req.headers['x-gateway-request-id']) {
        res.status(200).send('OK');
      } else {
        res.status(400).send('Invalid');
      }
    };

    app.get('/api/v1/*', checkHeader);

    server = app.listen(8081, function () {
      testGw = child_process.fork('./test-server/server.js');
      setTimeout(() => done(), 4000);
    });
  });

  after(function () {
    server.close();
    testGw.kill();
  })

  it('should add request id to the request and response', function () {
    return request
      .get('/api/v1/test')
      .expect(200)
      .expect((res) => res.headers.should.have.property('x-gateway-request-id'))
  });
})