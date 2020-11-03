const fs = require('fs');
const sets = require('./sets.json');
const {
  getTCGPlayerId,
  getTCGPlayerSet,
  sortCardsByName,
  sortSetsEntriesByName,
} = require('./utils');

const PREMIUM_ICON_URL =
  'https://user-images.githubusercontent.com/343837/83360751-a631d080-a338-11ea-80c6-110971103bf4.png';

const PREMIUM_ICON = `[![premium](${PREMIUM_ICON_URL})](https://github.com/mtgenius/uncube)`;

const setsEntries = Object.entries(sets);
setsEntries.sort(sortSetsEntriesByName);

const setsMarkdown = [];
for (const [setName, { cards }] of setsEntries) {
  cards.sort(sortCardsByName);

  let setMarkdown = `## ${setName}`;
  setMarkdown += '\n\n';
  setMarkdown += '| Card name | TCGPlayer |\n';
  setMarkdown += '| :-------- | --------: |\n';
  for (const card of cards) {
    const tcgPlayerId = getTCGPlayerId(card);
    const tcgPlayerSet = getTCGPlayerSet(setName, card);
    const premiumIcon = card.premium ? ` ${PREMIUM_ICON}` : '';
    setMarkdown += `| ${card.name}${premiumIcon} | [Buy](https://shop.tcgplayer.com/magic/${tcgPlayerSet}/${tcgPlayerId}?utm_campaign=affiliate&utm_medium=GAMEDLEY&utm_source=GAMEDLEY) |`;
    setMarkdown += '\n';
  }

  setsMarkdown.push(setMarkdown);
}

fs.writeFileSync('./CARDS.md', setsMarkdown.join('\n\n'));
