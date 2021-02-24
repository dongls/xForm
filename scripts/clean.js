const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

const BASE_PATH = path.resolve(__dirname, '../')
const { packageNames } = require('./packages')

const r = packageNames
  .map(pn => {
    return {
      name: pn,
      path: `${BASE_PATH}/packages/${pn}/dist`
    }
  })
  .map(({ name, path }) => {
    if(!fs.existsSync(path)) return null
    
    try {
      fs.rmSync(path, { maxRetries: 10, recursive: true })
      return name
    } catch {
      return null
    }
  })
  .filter(n => n)

if(r.length > 0) console.log(chalk.green.bold('clean dist: ') + r.join(', ') + '\n')
