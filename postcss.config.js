module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-import'),
    require('postcss-custom-properties')({preserve: process.env.TARGET === 'document'})
  ]
}