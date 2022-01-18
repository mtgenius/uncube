const mapCardToNameMarkdown = require('../map/map-card-to-name-markdown');
const RunnableMapCardToBuyLink = require('../runnables/runnable-map-card-to-buy-link');
const RunnableMapDigitalCardToNameMarkdown = require('../runnables/runnable-map-digital-card-to-name-markdown');

module.exports = function mapPhysicalSetDefinitionToSetContent(setDefinition) {
  const mapCardToBuyLink = new RunnableMapCardToBuyLink(setDefinition);
  const mapDigitalCardToNameMarkdown = new RunnableMapDigitalCardToNameMarkdown(
    setDefinition.url,
  );

  const rows = [];

  rows.push('| Card name | TCGPlayer |');
  rows.push('| :-------- | --------: |');

  for (const card of setDefinition.cards) {
    if (Object.prototype.hasOwnProperty.call(card, 'banned')) {
      continue;
    }
    if (card.digital) {
      const name = mapDigitalCardToNameMarkdown.run(card);
      rows.push(`| ${name} | - |`);
    } else {
      const name = mapCardToNameMarkdown(card);
      const buyLink = mapCardToBuyLink.run(card);
      rows.push(`| ${name} | ${buyLink} |`);
    }
  }

  return rows.join('\n');
};
