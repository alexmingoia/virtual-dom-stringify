if (process.env.JSCOV) {
  module.exports = require('./lib-cov/stringify');
} else {
  module.exports = require('./lib/stringify');
}
