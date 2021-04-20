const mapCardToTcgPlayerId = require('../map/map-card-to-tcgplayer-id');
const mapStringToUrl = require('../map/map-string-to-url');

module.exports = class RunnableMapCardToBuyLink {
  constructor(setDefinition) {
    this._setDefinition = setDefinition;
    this.run = this.run.bind(this);
  }

  mapCardToTcgPlayerSet(card) {
    if (Object.prototype.hasOwnProperty.call(card, 'tcgplayer-set-url')) {
      return card['tcgplayer-set-url'];
    }

    if (
      Object.prototype.hasOwnProperty.call(this._setDefinition, 'tcgplayer-url')
    ) {
      return this._setDefinition['tcgplayer-url'];
    }

    return mapStringToUrl(this._setDefinition.title);
  }

  run(card) {
    const tcgPlayerId = mapCardToTcgPlayerId(card);
    const tcgPlayerSet = this.mapCardToTcgPlayerSet(card);
    return `[Buy](https://shop.tcgplayer.com/magic/${tcgPlayerSet}/${tcgPlayerId}?utm_campaign=affiliate&utm_medium=GAMEDLEY&utm_source=GAMEDLEY)`;
  }
};
