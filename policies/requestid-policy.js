const DEFAULT_REQUESTID_HEADER_NAME = 'x-gateway-request-id';

module.exports = {
  name: 'requestid',
  policy: (actionParams) => {
    return (req, res, next) => {
      console.log('executing requestid policy');

      let headerName = actionParams.headerName || DEFAULT_REQUESTID_HEADER_NAME;
      let requestId = req.egContext.requestID;

      req.headers[headerName] =  requestId;
      res.setHeader(headerName, requestId);

      console.log(`Header ${headerName} set to ${req.headers[headerName]}`);
      next();
    };
  }
};