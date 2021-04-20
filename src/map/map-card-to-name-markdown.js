const PREMIUM_ICON_MARKDOWN = require('../constants/premium-icon-markdown');

module.exports = function mapCardToNameMarkdown(card) {
  if (card.premium) {
    return `${card.name} ${PREMIUM_ICON_MARKDOWN}`;
  }
  return card.name;
};
