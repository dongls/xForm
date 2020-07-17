const IS_PRODUCTION = process.env.NODE_ENV == 'production'

const path = require('path')
const util = require('./util')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        loader: [
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
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        exclude: /packages\/common\/svg/,
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
      '@core': path.resolve(__dirname, '../../packages/core'),
      '@common': path.resolve(__dirname, '../../packages/common')
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx']
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      '__VERSION__': JSON.stringify(process.env.RELEASE_VERSION)
    })
  ],
  performance: {
    hints: false
  }
}