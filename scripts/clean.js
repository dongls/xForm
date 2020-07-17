const path = require('path')
const chalk = require('chalk')
const rimraf = require('rimraf')

const { packageNames } = require('./packages')

const BASE_PATH = path.resolve(__dirname, '../')
const dirs = packageNames.map(p => `${BASE_PATH}/packages/${p}/dist`)

for(const dir of dirs) rimraf.sync(dir)

console.log(chalk.green.bold('clean dist: ') + packageNames.join(', ') + '\n')