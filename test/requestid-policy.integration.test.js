// Validates that the policy correctly wires up to the express-gateway server and performs
// the correct actions.

const path = require('path');
const supertest = require('supertest');
const chai = require('chai');
const should = chai.should();

const getBackendServer = require('./get-backend-server');
const gateway = require('express-gateway/lib/gateway');
const plugins = require('express-gateway/lib/plugins');

const Config = require('express-gateway/lib/config/config');
const config = new Config();


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

        config.gatewayConfig = {
          http: {
            port: 0
          },
          apiEndpoints: {
            api: {
              host: '*',
              paths: '/api/v1/*'
            }
          },
          serviceEndpoints: {
            backend: {
              url: `http://localhost:${runningApp.port}`
            }
          },
          policies: ['proxy', 'requestid'],
          pipelines: {
            basic: {
              apiEndpoints: ['api'],
              policies: [{
                requestid: []
              }, {
                proxy: [{
                  action: {
                    serviceEndpoint: 'backend'
                  }
                }]
              }]
            }
          }
        };

        config.systemConfig = {
          plugins: {
            'express-gateway-plugin-requestid': {
              package: '../manifest.js'
            }
          }
        };

        let loadedPlugins = plugins.load({config});

        return gateway({
          plugins: loadedPlugins,
          config
        });
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
      .get('/api/v1/test')
      .expect(200)
      .expect((res) => res.headers.should.have.property('x-gateway-request-id'))
  });
});