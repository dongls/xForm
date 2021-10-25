const path = require('path')

function isEmptyString(value){
  return value == null || value.length == 0
}

process.env.NODE_ENV = process.env.NODE_ENV == 'production' ? 'production' : 'development'
process.env.VUE_VERSION = require('../package.json').devDependencies.vue.slice(1)

process.argv.slice(2).forEach(item => {
  if(/RELEASE_VERSION=/.test(item)) process.env.RELEASE_VERSION = item.split('=')[1]
  if(/RELEASE_TARGET=/.test(item)) process.env.RELEASE_TARGET = item.split('=')[1]
})

if(isEmptyString(process.env.RELEASE_VERSION)){
  process.env.RELEASE_VERSION = require('../package.json').version
}

if(isEmptyString(process.env.OUTPUT_BASE_PATH)){
  process.env.OUTPUT_BASE_PATH = path.resolve(__dirname, '../packages')
}

const IS_PRODUCTION = process.env.NODE_ENV == 'production'
const IS_DEV = process.env.NODE_ENV != 'production'

module.exports = {
  IS_PRODUCTION,
  IS_DEV,
  NODE_ENV: process.env.NODE_ENV,
  TARGET: process.env.TARGET,
  RELEASE_VERSION: process.env.RELEASE_VERSION,
  RELEASE_PACKAGE: process.env.RELEASE_PACKAGE,
  RELEASE_TARGET: process.env.RELEASE_TARGET,
  OUTPUT_BASE_PATH: process.env.OUTPUT_BASE_PATH
}