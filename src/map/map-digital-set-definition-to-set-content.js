const RunnableMapDigitalCardToNameMarkdown = require('../runnables/runnable-map-digital-card-to-name-markdown');

module.exports = function mapDigitalSetDefinitionToSetContent(setDefinition) {
  const mapDigitalCardToNameMarkdown = new RunnableMapDigitalCardToNameMarkdown(
    setDefinition.url,
  );

  const rows = [];

  rows.push('| Card name |');
  rows.push('| :-------- |');

  for (const card of setDefinition.cards) {
    if (Object.prototype.hasOwnProperty.call(card, 'banned')) {
      continue;
    }
    const name = mapDigitalCardToNameMarkdown.run(card);
    rows.push(`| ${name} |`);
  }

  return rows.join('\n');
};
