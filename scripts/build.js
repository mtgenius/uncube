const { readFileSync, writeFileSync } = require('fs');
const GITHUB_REPOSITORY = require('../src/constants/github-repository');
const SET_DEFINITIONS = require('../src/constants/set-definitions');
const mapSetDefinitionToSetContent = require('../src/map/map-set-definition-to-set-content');
const mapSetDefinitionToSetPath = require('../src/map/map-set-definition-to-set-path');

const setLinks = [];
for (const setDefinition of SET_DEFINITIONS) {
  const setPath = mapSetDefinitionToSetPath(setDefinition);
  const setContent = mapSetDefinitionToSetContent(setDefinition);
  writeFileSync(setPath, setContent);
  setLinks.push(
    `* [${setDefinition.title}](${GITHUB_REPOSITORY}/blob/master/sets/${setDefinition.url}.md)`,
  );
}

const README = readFileSync('README.md').toString();
const README_DESCRIPTION = README.split('## Sets')[0];
writeFileSync('README.md', `${README_DESCRIPTION}## Sets

${setLinks.join('\n')}
`);
