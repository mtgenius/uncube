const fs = require('fs');
const path = require('path');
const sortCardsByName = require('../sort/sort-cards-by-name');

module.exports = function mapSetDefinitionFileNameToSetDefinition(
  setDefinitionFileName,
) {
  const setDefinitionFilePath = path.join('src', 'sets', setDefinitionFileName);
  const setDefinitionFileContents = fs.readFileSync(setDefinitionFilePath);
  const setDefinition = JSON.parse(setDefinitionFileContents);

  setDefinition.cards.sort(sortCardsByName);

  const url = setDefinitionFileName.split('.json')[0];
  setDefinition.url = url;

  return setDefinition;
};
