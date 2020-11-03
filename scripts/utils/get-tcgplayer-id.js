const getCardUrl = require('./get-card-url');

module.exports = function getTCGPlayerId(card) {
  if (typeof card.tcgplayer === 'string') {
    return card.tcgplayer;
  }
  return getCardUrl(card);
};
