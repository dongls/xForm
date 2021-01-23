require('./extend-html')

const EMOJI_REG = require('emoji-regex')()
const MarkdownIt = require('markdown-it')
const highlight = require('./highlight')

const mdAttrs = require('markdown-it-attrs')
const mdAnchor = require('markdown-it-anchor')
const mdContainer = require('./md-container')
const mdSection = require('./md-section')

const md = new MarkdownIt({ html: true, highlight })
const genId = content => content.replace(/\s+/g, '').replace(EMOJI_REG, '')

md.use(mdAttrs)
md.use(mdAnchor, {
  slugify: genId,
  level: [2],
  permalink: true, 
  permalinkClass: 'article-anchor',
  permalinkBefore: true
})
md.use(mdContainer)
md.use(mdSection)
  
md.renderer.rules.heading_open = function(tokens, idx, options, env, slf){
  const token = tokens[idx]
  const next = tokens[idx + 1]
  
  // 需要包裹一下
  if(null != token && token.nesting == 1 && token.tag == 'h2' && null != next){
    token.attrJoin('class', 'head-anchor article-sticky-heading')
    token.attrSet('id', genId(next.content))
  }

  return slf.renderToken(tokens, idx, options)
}

md.renderer.rules.bullet_list_open = function(tokens, idx, options, env, slf){
  const token = tokens[idx]
  
  if(null != token){
    token.attrJoin('class', 'doc-ul')
  }

  return slf.renderToken(tokens, idx, options)
}


module.exports = md