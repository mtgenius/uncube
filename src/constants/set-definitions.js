const SET_DEFINITION_FILE_NAMES = require('../constants/set-definition-file-names');
const mapSetDefinitionFileNameToSetDefinition = require('../map/map-set-definition-file-name-to-set-definition');

const setDefinitions = new Set();

for (const setDefinitionFileName of SET_DEFINITION_FILE_NAMES) {
  const setDefinition = mapSetDefinitionFileNameToSetDefinition(setDefinitionFileName);
  setDefinitions.add(setDefinition);
}

module.exports = setDefinitions;
