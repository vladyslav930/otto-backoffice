const baseConfig = require('./jest.config');

module.exports = Object.assign({}, baseConfig, {
  bail: 5,
  notify: true,
  notifyMode: 'change',
});
