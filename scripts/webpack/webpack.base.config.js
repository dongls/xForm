const IS_PRODUCTION = process.env.NODE_ENV == 'production'
const RELEASE_TARGET = process.env.RELEASE_TARGET

const path = require('path')
const webpack = require('webpack')
const utils = require('../utils')
const { VueLoaderPlugin } = require('vue-loader')

function genTarget(){
  if(!IS_PRODUCTION || RELEASE_TARGET == 'bundler') return 'web'
  if(RELEASE_TARGET == 'esm') return 'browserslist:esm'

  return 'browserslist:umd'
}

module.exports = {
  target: genTarget(),
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          enableTsInTemplate: false
        }
      },
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader', 
            options: { 
              appendTsxSuffixTo: [/\.vue$/]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: utils.genCssLoader(IS_PRODUCTION, true)
          },
          {
            use: utils.genCssLoader(IS_PRODUCTION, false)
          }
        ]
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: utils.genScssLoader(IS_PRODUCTION, true)
          },
          {
            use: utils.genScssLoader(IS_PRODUCTION, false)
          }
        ]
      },
      {
        test: /\.less$/,
        use: utils.genLessLoader(IS_PRODUCTION)
      },
      { // 处理字体
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        options: IS_PRODUCTION ? {
          name: 'font/[name].[ext]'
        } : undefined
      },
      {
        test: /\.(png|jpe?g|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: IS_PRODUCTION ? {
          limit: 4096,
          path: '',
          name: 'img/[name].[ext]',
        } : undefined
      }
    ]
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, '../../packages/common'),
      '@document': path.resolve(__dirname, '../../document'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      '__IS_DEV__': JSON.stringify(process.env.NODE_ENV == 'development'),
      '__IS_TEST__': JSON.stringify(false),
      '__VERSION__': JSON.stringify(process.env.RELEASE_VERSION),
      '__VUE_OPTIONS_API__': JSON.stringify(true),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(!IS_PRODUCTION),
      '__VUE_VERSION__': JSON.stringify(process.env.VUE_VERSION),
      '__TIMESTAMP__': utils.getTimestamp()
    }),
    new VueLoaderPlugin()
  ]
}