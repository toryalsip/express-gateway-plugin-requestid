// Validates that the policy correctly wires up to the express-gateway server and performs
// the correct actions.

const path = require('path');
const supertest = require('supertest');
const chai = require('chai');
const should = chai.should();

const { getBackendServer, createGateway, createGatewayConfig } = 
  require('express-gateway-test-tools');

let server = undefined;
let testGw = undefined;
let request = undefined;

process.env.EG_DISABLE_CONFIG_WATCH = 'true';

describe('requestid-policy integration', function () {
  before(function () {
    this.timeout(10000);
    const checkHeader = (req, res) => {
      if (req.headers['x-gateway-request-id']) {
        res.status(200).send('OK');
      } else {
        res.status(400).send('Invalid');
      }
    };

    return getBackendServer(0, checkHeader)
      .then((runningApp) => {
        server = runningApp.app;

        let gwConfig = createGatewayConfig();
        gwConfig.serviceEndpoints.backend.url = `http://localhost:${runningApp.port}`;

        const policiesToTest = [{
          'requestid': []
        }];

        return createGateway(gwConfig, '../manifest.js', policiesToTest);
      }).then((gw) => {
        testGw = gw.app
        request = supertest(testGw);
      });
  });

  after(function () {
    server.close();
    testGw.close();
  });

  it('should have request id in response from gateway', function () {
    return request
      .get('/ip')
      .expect(200)
      .expect((res) => res.headers.should.have.property('x-gateway-request-id'))
  });
});