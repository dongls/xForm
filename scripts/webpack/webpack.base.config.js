const IS_PRODUCTION = process.env.NODE_ENV == 'production'

const path = require('path')
const util = require('./util')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  target: IS_PRODUCTION ? 'browserslist' : 'web',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader', 
            options: { 
              appendTsSuffixTo: [/\.vue$/] 
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
        use: util.genCssLoader(IS_PRODUCTION)
      },
      {
        test: /\.scss$/,
        use: util.genScssLoader(IS_PRODUCTION)
      },
      {
        test: /\.less$/,
        use: util.genLessLoader(IS_PRODUCTION)
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
      '@model': path.resolve(__dirname, '../../packages/core/model'),
      '@core': path.resolve(__dirname, '../../packages/core'),
      '@common': path.resolve(__dirname, '../../packages/common'),
      '@packages': path.resolve(__dirname, '../../packages'),
      '@document': path.resolve(__dirname, '../../document'),
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx']
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      '__VUE_OPTIONS_API__': JSON.stringify(true),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(!IS_PRODUCTION),
      '__VERSION__': JSON.stringify(process.env.RELEASE_VERSION),
      '__IS_DEV__': JSON.stringify(process.env.NODE_ENV == 'development'),
      '__VUE_VERSION__': JSON.stringify(process.env.VUE_VERSION)
    })
  ]
}