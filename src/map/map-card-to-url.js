const mapStringToUrl = require('../map/map-string-to-url');

module.exports = function mapCardToUrl(card) {
  if (Object.prototype.hasOwnProperty.call(card, 'id')) {
    return card.id;
  }

  return mapStringToUrl(card.name);
};
