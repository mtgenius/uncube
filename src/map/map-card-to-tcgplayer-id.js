const mapStringToUrl = require('../map/map-string-to-url');

module.exports = function mapCardToTCGPlayerId(card) {
  if (Object.prototype.hasOwnProperty.call(card, 'tcgplayer')) {
    return card.tcgplayer;
  }

  return mapStringToUrl(card.name);
};
