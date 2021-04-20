const mapDigitalSetDefinitionToSetContent = require('./map-digital-set-definition-to-set-content');
const mapPhysicalSetDefinitionToSetContent = require('./map-physical-set-definition-to-set-content');

module.exports = function mapSetDefinitionToSetContent(setDefinition) {
  const rows = [];

  rows.push(`## ${setDefinition.title}`);
  rows.push('');

  if (setDefinition.digital) {
    rows.push(mapDigitalSetDefinitionToSetContent(setDefinition));
  } else {
    rows.push(mapPhysicalSetDefinitionToSetContent(setDefinition));
  }

  rows.push('');
  
  return rows.join('\n');
};
