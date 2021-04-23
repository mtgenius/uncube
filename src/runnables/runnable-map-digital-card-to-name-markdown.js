const GITHUB_REPOSITORY = require('../constants/github-repository');
const PREMIUM_ICON_MARKDOWN = require('../constants/premium-icon-markdown');
const mapCardToUrl = require('../map/map-card-to-url');

module.exports = class RunnableMapDigitalCardToNameMarkdown {
  constructor(setUrl) {
    this._setUrl = setUrl;
    this.run = this.run.bind(this);
  }

  run(card) {
    const urlId = mapCardToUrl(card);
    const url = `${GITHUB_REPOSITORY}/raw/master/cards/${this._setUrl}/${urlId}.png`;
    if (card.premium) {
      return `[${card.name}](${url}) ${PREMIUM_ICON_MARKDOWN}`;
    }
    return `[${card.name}](${url})`;
  }
};
