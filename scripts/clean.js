const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

const { cleanTypes } = require('./gen-dts/utils')

const BASE_PATH = path.resolve(__dirname, '../')
const { packageNames } = require('./packages')

const r = packageNames
  .map(pn => {
    return {
      name: pn,
      dirPath: `${BASE_PATH}/packages/${pn}/dist`
    }
  })
  .map(({ name, dirPath }) => {
    if(name == 'core') cleanTypes()
    if(!fs.existsSync(dirPath)) return null
    try {
      fs.rmSync(dirPath, { maxRetries: 10, recursive: true })
      return name
    } catch {
      return null
    }
  })
  .filter(n => n)

if(r.length > 0) console.log(chalk.green.bold('clean dist: ') + r.join(', ') + '\n')
