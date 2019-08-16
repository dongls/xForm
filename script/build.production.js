process.env.NODE_ENV = 'production';
process.argv.slice(2).forEach(item => {
  if(/RELEASE_VERSION=/.test(item)) process.env.RELEASE_VERSION = item.split('=')[1];
  if(/RELEASE_TARGET=/.test(item)) process.env.RELEASE_TARGET = item.split('=')[1];
})

if(null == process.env.RELEASE_VERSION || '' == process.env.RELEASE_VERSION){
  process.env.RELEASE_VERSION = require('../package.json').version;
}

const webpack = require('webpack')
const config = require('../config/webpack.production.config');

const statsOptions = {
  colors: true,
  modules: false,
  children: false,
  entrypoints: false
}

webpack(config, function (err, stats) {
  if (err) return console.log(err);

  console.log(stats.toString(statsOptions))
});