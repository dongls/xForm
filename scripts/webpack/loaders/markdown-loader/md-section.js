function isH2(token){
  return token.type == 'heading_open' && token.tag == 'h2'
}

function buildSection(part, state){
  const open = new state.Token('block', 'section', 1)
  open.block = true

  const close = new state.Token('block', 'section', -1)
  close.block = true

  part.unshift(open)
  part.push(close)
  return part
}

module.exports = function(md){
  md.core.ruler.push('section', function(state){
    const tokens = state.tokens
    const ids = tokens.map((t, i) => isH2(t) ? i : -1).filter(i => i >= 0)
    if(ids[0] > 0) ids.unshift(0)
    if(ids[ids.length - 1] < ids.length) ids.push(ids.length)

    state.tokens = ids.reduce((acc, item, index, arr) => {
      const next = arr[index + 1]
      const part = tokens.slice(item, next)
      return acc.concat(buildSection(part, state))
    }, [])
  })
}