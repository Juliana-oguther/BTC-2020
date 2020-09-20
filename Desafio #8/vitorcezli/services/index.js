const { data: { category: CATEGORY } } = require('../config');
const audio = require('./audio');
const nlu = require('./nlu');
const Recommend = require('./recommend');
const recommend = new Recommend(CATEGORY);  // Use as singleton.

module.exports = { audio, nlu, recommend };
