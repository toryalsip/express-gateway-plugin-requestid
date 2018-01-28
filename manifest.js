module.exports = {
  version: '1.0.0',
  policies: ['requestid'],
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'requestid',
      policy: (actionParams) => require('./policies/requestid-policy')(actionParams)
    });
  }
};