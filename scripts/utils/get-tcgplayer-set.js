module.exports = function getTCGPlayerSet(setName, card) {
  if (Object.prototype.hasOwnProperty.call(card, 'tcgplayer-set')) {
    return card['tcgplayer-set'];
  }
  return setName.toLowerCase();
};
