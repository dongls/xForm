const { getOptions } = require('loader-utils')
const md = require('./markdown-it')

module.exports = function (source) {
  const options = getOptions(this)
  const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true
  const prefix = esModule ? 'export default' : 'module.exports ='

  const html = md.render(source).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
  return `${prefix} ${JSON.stringify(html)};`
}