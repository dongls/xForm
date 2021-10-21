const execa = require('execa')
const utils = require('./utils')

utils.cleanAll()

execa.sync(
  'node_modules/.bin/webpack', 
  [
    'serve',
    '--config',
    'scripts/webpack/webpack.document.config.js',
  ],
  {
    stdio: 'inherit',
    env: { 'NODE_ENV': 'development' }
  }
)
