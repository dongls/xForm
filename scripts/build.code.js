const version = require('../package.json').version
const utils = require('./utils')

utils.cleanAll()
utils.buildCode(version)