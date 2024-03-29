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
        oneOf: [
          {
            test: /\.module\.scss$/,
            use: utils.genScssLoader(IS_PRODUCTION, true)
          },
          {
            test: /\.scss$/,
            resourceQuery: /module/,
            use: utils.genScssLoader(IS_PRODUCTION, true)
          },
          {
            test: /\.scss$/,
            use: utils.genScssLoader(IS_PRODUCTION, false)
          },
          {
            test: /\.module\.css$/,
            use: utils.genCssLoader(IS_PRODUCTION, true)
          },
          {
            test: /\.css$/,
            resourceQuery: /module/,
            use: utils.genCssLoader(IS_PRODUCTION, true)
          },
          {
            test: /\.css$/,
            use: utils.genCssLoader(IS_PRODUCTION, false)
          }
        ]
      },
      // {
      //   test: /\.less$/,
      //   use: utils.genLessLoader(IS_PRODUCTION)
      // },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        type: 'asset',
        generator: {
          outputPath: IS_PRODUCTION ? 'font' : undefined
        }
      },
      {
        test: /\.(png|jpe?g)(\?.*)?$/,
        type: 'asset',
        generator: {
          outputPath: IS_PRODUCTION ? 'img' : undefined,
        }
      },
      {
        oneOf: [
          {
            resourceQuery: /raw-loader/,
            type: 'asset/source',
          },
          {
            test: /\.(svg)(\?.*)?$/,
            type: 'asset',
            generator: {
              outputPath: IS_PRODUCTION ? 'img' : undefined,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, '../../packages/common'),
      '@document': path.resolve(__dirname, '../../document'),
      '@bootstrap': path.resolve(__dirname, '../../packages/bootstrap'),
      '@element-plus': path.resolve(__dirname, '../../packages/element-plus'),
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
      '__TIMESTAMP__': JSON.stringify(utils.getTimestamp())
    }),
    new VueLoaderPlugin()
  ]
}