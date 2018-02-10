const DEFAULT_REQUESTID_HEADER_NAME = 'x-gateway-request-id';


module.exports = (logger) => {
  return {
    name: 'requestid',
    policy: (actionParams) => {
      return (req, res, next) => {
        logger.debug('executing requestid policy');

        let headerName = actionParams.headerName || DEFAULT_REQUESTID_HEADER_NAME;
        let requestId = req.egContext.requestID;

        req.headers[headerName] = requestId;
        res.setHeader(headerName, requestId);

        logger.debug(`Header ${headerName} set to ${req.headers[headerName]}`);
        next();
      };
    }
  }
};