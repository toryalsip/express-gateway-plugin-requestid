const child_process = require('child_process');
const request = require('supertest');

module.exports = function (port) {
  return new Promise((resolve, reject) => {
    let gw = child_process.fork('./test-server/server.js');
    let count = 0;
    const interval = setInterval(() => {
      count++; // Waiting for process to start, ignoring conn refused errors
      request(`http://localhost:${port}`)
        .get('/not-found')
        .end((err, res) => {
          if (res && res.statusCode === 404) {
            clearInterval(interval);
            resolve(gw);
          } else if (count >= 25) {
            clearInterval(interval);
            reject(new Error('Failed to start Express Gateway'));
          }
        });
    }, 300);
  });

};