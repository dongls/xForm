const { escapeHtml } = require('markdown-it/lib/common/utils')
const hljs = require('highlight.js/lib/core') 

hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))

function genHtml(str, lang){
  if(!lang || null == hljs.getLanguage(lang)) return escapeHtml(str)

  try {
    return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
  } catch (e) {
    return ''
  }
}

module.exports = function (str, lang) {
  return `<pre class="hljs" language="${lang}"><code class="hljs-code">${genHtml(str, lang)}</code></pre>`
}