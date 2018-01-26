const DEFAULT_REQUESTID_HEADER_NAME = 'x-gateway-request-id';
const uuid = require('uuid');

module.exports = {
  name: 'requestid',
  policy: (actionParams) => {
    return (req, res, next) => {
      console.log('executing requestid policy');

      let headerName = actionParams.headerName || DEFAULT_REQUESTID_HEADER_NAME;

      req.headers[headerName] = uuid();

      res.setHeader(headerName, req.headers[headerName]);

      console.log(`Header ${headerName} set to ${req.headers[headerName]}`);
      
      next();
    };
  }
};