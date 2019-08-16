const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  genCssLoader(isProduction){
    return [
      isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      'css-loader',
      'postcss-loader'
    ]
  },
  genScssLoader(isProduction){
    return [
      isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ];
  },
  genLessLoader(isProduction){
    return [
      isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'less-loader'
    ];
  }
}