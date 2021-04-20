const fs = require('fs');
const SET_DEFINITIONS_PATH = require('../constants/set-definitions-path');

module.exports = fs.readdirSync(SET_DEFINITIONS_PATH);
