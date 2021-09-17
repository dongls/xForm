const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { RELEASE_PACKAGE } = require('./args')
const { packages } = require('../packages')

const FMT_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
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

module.exports = {
  genCssLoader(IS_PRODUCTION, IS_MODULE = false){
    return [
      IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      createCssLoader(IS_PRODUCTION, IS_MODULE),
      'postcss-loader'
    ]
  },
  genScssLoader(IS_PRODUCTION, IS_MODULE = false){
    return [
      IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      createCssLoader(IS_PRODUCTION, IS_MODULE),
      'postcss-loader',
      'sass-loader'
    ]
  },
  genLessLoader(IS_PRODUCTION, IS_MODULE = false){
    return [
      IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      createCssLoader(IS_PRODUCTION, IS_MODULE),
      'postcss-loader',
      'less-loader'
    ]
  },
  genPackageProps(){
    const rp = RELEASE_PACKAGE

    return {
      entry: packages[rp],
      packageName: `@dongls/xform${rp == 'core' ? '' : '.' + rp}`,
      outPath: path.resolve(__dirname, '../../packages', rp, 'dist'),
      library: rp == 'core' ? 'XForm' : ['XForm', rp],
      libraryExport: rp == 'core' ? undefined : 'default'
    }
  },
  genHtmlWebpackPlugin(filename, options = {}){
    const defMeta = {
      'xform:date': (new Date()).toLocaleDateString('zh-CN', FMT_OPTIONS)
    }
    const meta = Object.assign({}, defMeta, options.meta || {})

    return new HtmlWebpackPlugin({
      template: options.template || './document/index.html',
      filename,
      meta
    })
  }
}