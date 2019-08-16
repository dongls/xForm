/** postcss配置 @author dongls */
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-custom-properties')({preserve: false})
  ]
}