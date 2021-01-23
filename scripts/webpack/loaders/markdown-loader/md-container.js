const Container = require('markdown-it-container')

const CONTAINER_REG = /^\W*(danger|tip|warning)(?:\s+(.*))?$/
const validate = params => CONTAINER_REG.test(params)

const CODEBOX_REG = /^code-box\s*(.*)$/

function render(tokens, idx){
  const token = tokens[idx]

  if(token.nesting == 1){
    const info = token.info
    const result = info.match(CONTAINER_REG)
    const type = result[1] || 'tip'
    const title = result[2]
    const head = title ? `<h3 class="md-container-title">${title}</h3>` : ''
    return `<div class="md-container md-container-${type}">${ head }`
  }

  return '</div>'
}

module.exports = function(md){
  md.use(Container, 'alert', { validate, render })
  md.use(Container, 'code-box', {
    validate(params) {
      return params.trim().match(CODEBOX_REG)
    },
    render(tokens, idx) {
      return tokens[idx].nesting === 1 ? '<code-box>' : '</code-box>'
    }
  })
  return md
}