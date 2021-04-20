const GITHUB_REPOSITORY = require('../constants/github-repository');
const mapCardToNameMarkdown = require('../map/map-card-to-name-markdown');
const mapCardToUrl = require('../map/map-card-to-url');

module.exports = class RunnableMapDigitalCardToNameMarkdown {
  constructor(setUrl) {
    this._setUrl = setUrl;
    this.run = this.run.bind(this);
  }

  run(card) {
    const name = mapCardToNameMarkdown(card);
    const url = mapCardToUrl(card);
    return `[${name}](${GITHUB_REPOSITORY}/raw/master/cards/${this._setUrl}/${url}.png)`;
  }
};
