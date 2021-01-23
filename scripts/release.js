const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')
const { prompt } = require('enquirer')
const { packageNames } = require('./packages')

const VERSION_REG = /^[0-9]+\.[0-9]+\.[0-9]+$/
const EXIT_REG = /[nN]/
const EXIT_MESSAGE = '终止发布'

function cleanCode(){
  execa.commandSync('npm run clean')
}

function getPackageVersion(){
  return require('../package.json').version
}

async function inputVersion(){
  console.log(`当前版本号为: ${chalk.green.bold(getPackageVersion())}`)
  const { input } = await prompt({
    type: 'input',
    name: 'input',
    message: '请输入新的版本号,输入[n/N]退出',
    validate(value){
      if(EXIT_REG.test(value) || VERSION_REG.test(value)) return true

      return '请输入正确的版本号[major.minor.patch]，或着输入[n/N]退出'
    }
  })

  return EXIT_REG.test(input) ? null : input
}

function updatePackageJson(file, version){
  const json = require(file)
  json.version = version
  fs.writeFileSync(file, JSON.stringify(json, null, '  ') + '\n')
}
 
function buildPackage(package, version){
  updatePackageJson(path.resolve(__dirname, '../packages', package, 'package.json'), version)
  if(package == 'core') updatePackageJson(path.resolve(__dirname, '../package.json'), version)
  
  execa.commandSync(`npm run build:${package}`, { stdio: 'inherit' })
  console.log('已构建包：' + chalk.green.bold(package) + '\n')
}

async function releaseCode(){
  const version = await inputVersion()
  if(version == null) return console.log(EXIT_MESSAGE)

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `确定要发布版本 v${version}?`
  })

  if(!yes) return console.log(EXIT_MESSAGE)

  process.env.RELEASE_VERSION = version
  cleanCode()

  // 测试
  execa.commandSync('npm run test', { stdio: 'inherit' })
  console.log('已完成代码测试\n')

  // document
  buildDocument()
  
  // build package
  for(const package of packageNames) buildPackage(package, version)

  // commit
  execa.commandSync('git add .')
  execa.sync('git', ['commit', '-m', 'release: v' + version])

  // publish
  for(const package of packageNames){
    const cwd = path.resolve(__dirname, '../packages', package)
    execa.commandSync('npm publish', { stdio: 'inherit', cwd })
    console.log('已发布包：' + chalk.green.bold(`${package}@${version}\n`))
  }

  // tag
  execa.sync('git', ['tag', `v${version}`])
  execa.sync('git', ['push', 'origin', `v${version}`])
  execa.commandSync('git push')

  console.log(`========== ${chalk.green.bold('发布完成')} ==========\n`)
}

function buildDocument(){
  execa.commandSync('npm run build:document', { stdio: 'inherit' })
  console.log('已构建文档\n')
}

function releaseDocument(){
  cleanCode()
  buildDocument()
  execa.commandSync('git add .')
  execa.sync('git', ['commit', '-m', 'docs: build document'])
  execa.commandSync('git push')
  console.log('已发布文档\n')
}

async function release(){
  const { type } = await prompt({
    type: 'select',
    name: 'type',
    message: '请选择发布的类型',
    choices: ['document', 'code']
  })

  if(type == 'code') return releaseCode()
  if(type == 'document') return releaseDocument()
}

release().catch(err => {
  console.error(err)
})