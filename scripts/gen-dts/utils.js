const fs = require('fs')
const execa = require('execa')
const path = require('path')
const dir = path.resolve(__dirname, '../../packages/core/types')

function cleanTypes(){
  try {
    if(fs.existsSync(dir)) {
      fs.rmSync(dir, { maxRetries: 10, recursive: true })
    }
    return true
  } catch (error) {
    return false
  }
}


// TODO: 等待api-extractor更新
function genTypes(){
  execa.sync('node_modules/.bin/tsc', [
    '--project',
    'scripts/gen-dts/dts.json',
    '--declarationDir', 
    dir
  ], { stdout: 'inherit' })
  
  console.log('已生成声明文件\n')
}

module.exports = {
  cleanTypes,
  genTypes
}