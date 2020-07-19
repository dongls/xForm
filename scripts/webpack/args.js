process.env.NODE_ENV = process.env.NODE_ENV == 'production' ? 'production' : 'development'
process.env.VUE_VERSION = require('../../package.json').devDependencies.vue.slice(1)

process.argv.slice(2).forEach(item => {
  if(/RELEASE_VERSION=/.test(item)) process.env.RELEASE_VERSION = item.split('=')[1]
  if(/RELEASE_TARGET=/.test(item)) process.env.RELEASE_TARGET = item.split('=')[1]
})

if(null == process.env.RELEASE_VERSION || '' == process.env.RELEASE_VERSION){
  process.env.RELEASE_VERSION = require('../../package.json').version
}

const IS_PRODUCTION = process.env.NODE_ENV == 'production'
const IS_DEV = process.env.NODE_ENV != 'production'

module.exports = {
  IS_PRODUCTION,
  IS_DEV,
  NODE_ENV: process.env.NODE_ENV,
  TARGET: process.env.TARGET,
  RELEASE_VERSION: process.env.RELEASE_VERSION,
  RELEASE_PACKAGE: process.env.RELEASE_PACKAGE
}