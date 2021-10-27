const { parseQuery } = require('loader-utils')
const md = require('./markdown-it')

function getOptions(loaderContext) {
  const query = loaderContext.query
  if (typeof query === 'string' && query !== '') return parseQuery(loaderContext.query)
  if (!query || typeof query !== 'object') return {}
  return query
}

module.exports = function (source) {
  const options = getOptions(this)
  const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true
  const prefix = esModule ? 'export default' : 'module.exports ='

  const html = md.render(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/__VERSION__/g, process.env.RELEASE_VERSION)
  
  const HAS_HTML_LOADER = this.loaders.some(l => /\/html-loader\//.test(l.path))
  return HAS_HTML_LOADER ? html : `${prefix} ${JSON.stringify(html)};`
}