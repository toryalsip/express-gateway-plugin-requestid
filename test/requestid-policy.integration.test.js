// Vslidates that the policy correctly wires up to the express-gateway server and performs
// the correct actions.

const child_process = require('child_process');
const supertest = require('supertest');
const chai = require('chai');
const should = chai.should();

const findOpenPorts = require('../test-server/find-open-port');
const getBackendServer = require('../test-server/get-backend-server');

let server = undefined;
let testGw = undefined;
let request = undefined;


describe('requestid-policy integration', function () {
  before(function () {
    this.timeout(10000);
    return findOpenPorts(2)
      .then((ports) => {
        process.env.TEST_GW_PORT = ports[0];
        process.env.TEST_BACKEND_PORT = ports[1];

        request = supertest(`http://localhost:${ports[0]}`);

        const checkHeader = (req, res) => {
          if (req.headers['x-gateway-request-id']) {
            res.status(200).send('OK');
          } else {
            res.status(400).send('Invalid');
          }
        };
        return getBackendServer(ports[1], checkHeader);
      }).then((runningApp) => {
        server = runningApp.app;
        return new Promise((resolve, reject) => {
          testGw = child_process.fork('./test-server/server.js');
          let count = 0;
          const interval = setInterval(() => {
            count++; // Waiting for process to start, ignoring conn refused errors
            request
              .get('/not-found')
              .end((err, res) => {
                if (res && res.statusCode === 404) {
                  clearInterval(interval);
                  resolve();
                } else if (count >= 25) {
                  clearInterval(interval);
                  reject(new Error('Failed to start Express Gateway'));
                }
              });
          }, 300);
        });
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