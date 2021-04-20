const path = require('path');

module.exports = function mapSetDefinitionToSetPath({ url }) {
  const file = `${url}.md`;
  return path.join('sets', file);
};
