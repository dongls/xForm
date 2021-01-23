module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-custom-properties')({preserve: process.env.TARGET === 'document'}),
    require('autoprefixer')
  ]
}