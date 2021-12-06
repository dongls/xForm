const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { prompt } = require('enquirer')
const { RELEASE_PACKAGE, OUTPUT_BASE_PATH } = require('./args')

const packages = {
  'core': {
    entry: ['./packages/core/index.css', './packages/core/index.ts'],
    ts: ['./packages/core/index.ts']
  },
  'bootstrap': {
    entry: ['./packages/bootstrap/index.ts']
  },
  'element-plus': {
    entry: ['./packages/element-plus/index.ts']
  }
}

const VERSION_REG = /^[0-9]+\.[0-9]+\.[0-9]+$/
const EXIT_REG = /[nN]/
const EXIT_MESSAGE = '终止发布'
const VUE_VERSION = require('../package.json').devDependencies.vue
const BASE_PATH = path.resolve(__dirname, '../')
const TYPES_DIR = BASE_PATH + '/packages/core/types'
const OUTPUT_TYPES = ['umd', 'esm', 'bundler']
const packageNames = Object.keys(packages)
const ARROW_INFO = chalk.blue.bold('➜') + '  '
const ARROW_SUCC = chalk.green.bold('➜') + '  '

function fillZero(num){
  return num < 10 ? '0' + num : num
}

function getTimestamp(){
  const f = fillZero
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()
  const min = now.getMinutes()
  return `${f(month)}${f(day)}${f(hour)}${f(min)}`
}

function createCssLoader(IS_PRODUCTION, IS_MODULE){
  return {
    loader: 'css-loader',
    options: {
      modules: IS_MODULE 
        ? { localIdentName: IS_PRODUCTION ? '[hash:base64]' : '[path][name]__[local]' } 
        : false
    }
  }
}

function genCssLoader(IS_PRODUCTION, IS_MODULE = false){
  return [
    IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    createCssLoader(IS_PRODUCTION, IS_MODULE),
    'postcss-loader'
  ]
}

function genScssLoader(IS_PRODUCTION, IS_MODULE = false){
  return [
    IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    createCssLoader(IS_PRODUCTION, IS_MODULE),
    'postcss-loader',
    'sass-loader'
  ]
}

function genLessLoader(IS_PRODUCTION, IS_MODULE = false){
  return [
    IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    createCssLoader(IS_PRODUCTION, IS_MODULE),
    'postcss-loader',
    'less-loader'
  ]
}

function genName(name){
  const keys = name.split('-')
  return keys.map(key => key[0].toUpperCase() + key.slice(1)).join('')
}

function genPackageProps(){
  const rp = RELEASE_PACKAGE

  return {
    ...packages[rp],
    packageName: `@dongls/xform${rp == 'core' ? '' : '.' + rp}`,
    outPath: path.resolve(OUTPUT_BASE_PATH, rp, 'dist'),
    library: rp == 'core' ? 'xForm' : ['xForm', genName(rp)],
    libraryExport: rp == 'core' ? undefined : 'default'
  }
}

function genHtmlWebpackPlugin(filename, options = {}){
  return new HtmlWebpackPlugin({
    template: options.template || './document/index.html',
    filename,
    minify: false
  })
}

function cleanAll(){
  const dirs = [
    ...packageNames.map(pn => `${BASE_PATH}/packages/${pn}/dist`),
    TYPES_DIR
  ]    
    
  const r = dirs.map(cleanDir).filter(n => n)

  if(r.length > 0) {
    const message = r.map(i => ` - ${i}`).join('\n')
    console.log(chalk.green.bold('clean dir: \n') + message + '\n')
  }
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

  const peerDependencies = json.peerDependencies
  if(peerDependencies != null){
    if(peerDependencies.vue != null) peerDependencies.vue = VUE_VERSION
    if(peerDependencies['@dongls/xform'] != null) peerDependencies['@dongls/xform'] = version
  }

  fs.writeFileSync(file, JSON.stringify(json, null, '  ') + '\n')
}

// 构建
function build(package, target){
  const name = chalk.red.bold(`${package}.${target}`)
  console.log(ARROW_INFO + `构建包: ${name}\n`)
  
  const env = {
    'NODE_ENV': 'production',
    'RELEASE_PACKAGE': package,
    'RELEASE_TARGET': target
  }

  execa.sync('node_modules/.bin/webpack', [
    '--config',
    'scripts/webpack/webpack.production.config.js'
  ], { stdio: 'inherit', env })
}
 
function buildPackage(package, version){
  if(version) updatePackageJson(path.resolve(__dirname, '../packages', package, 'package.json'), version)
  OUTPUT_TYPES.forEach(target => build(package, target))

  // 生成声明文件
  if(package == 'core') buildTypes()
  
  console.log(ARROW_SUCC + '已构建包：' + chalk.green.bold(package) + '\n')
}

function buildCode(version){
  for(const package of packageNames) buildPackage(package, version)
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

  cleanAll()

  // 更新版本号
  process.env.RELEASE_VERSION = version
  updatePackageJson(path.resolve(__dirname, '../package.json'), version)

  // 测试
  execa.commandSync('npm run test', { stdio: 'inherit' })
  console.log(ARROW_SUCC + '已完成代码测试\n')

  buildDocument()
  buildCode(version)
  
  // commit
  execa.commandSync('git add .')
  execa.sync('git', ['commit', '-m', 'release: v' + version])

  // publish
  for(const package of packageNames){
    const cwd = path.resolve(__dirname, '../packages', package)
    execa.commandSync('npm publish', { stdio: 'inherit', cwd })
    console.log(ARROW_SUCC + '已发布包：' + chalk.green.bold(`${package}@${version}\n`))
  }

  // tag
  execa.sync('git', ['tag', `v${version}`])
  execa.sync('git', ['push', 'origin', `v${version}`])
  execa.commandSync('git push')

  console.log(`========== ${chalk.green.bold('发布完成')} ==========\n`)
}

function buildDocument(){
  console.log(ARROW_INFO + '构建文档\n')

  const env = {
    'NODE_ENV': 'production',
    'TARGET': 'document',
  }

  execa.sync('node_modules/.bin/webpack', [
    '--config',
    'scripts/webpack/webpack.document.config.js',
    '--progress'
  ], { stdio: 'inherit', env })

  console.log(ARROW_SUCC + '已构建文档\n')
}

function releaseDocument(){
  cleanAll()
  buildDocument()
  execa.commandSync('git add .')
  execa.sync('git', ['commit', '-m', 'docs: build document'])
  execa.commandSync('git push')
  console.log(ARROW_SUCC + '已发布文档\n')
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

function cleanTypes(){
  cleanDir(TYPES_DIR)
}

function buildTypes(){
  console.log(ARROW_INFO + '构建声明文件\n')

  execa.sync('node_modules/.bin/tsc', [
    '--project',
    'scripts/types.json',
    '--declarationDir', 
    TYPES_DIR
  ], { stdio: 'inherit' })

  execa.sync('node_modules/.bin/api-extractor', [
    'run',
    '--local',
    '--verbose' 
  ], { stdio: 'inherit' })
  
  cleanTypes()

  console.log(ARROW_SUCC + '成功构建声明文件\n')
}

function cleanDir(dirPath){
  if(!fs.existsSync(dirPath)) return null

  try {
    fs.rmSync(dirPath, { maxRetries: 10, recursive: true })
    return dirPath
  } catch {
    return null
  }
}

module.exports = {
  buildCode,
  buildDocument,
  buildPackage,
  buildTypes,
  cleanAll,
  cleanDir,
  cleanTypes,
  genCssLoader,
  genHtmlWebpackPlugin,
  genLessLoader,
  genPackageProps,
  genScssLoader,
  getTimestamp,
  release,
}