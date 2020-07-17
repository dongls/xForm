require('markdown-it/lib/common/html_blocks').push('md-meta')

const EMOJI_REG = require('emoji-regex')()
const MarkdownIt = require('markdown-it')
const highlight = require('./highlight')
const mdContainer = require('./md-container')
const mdAttrs = require('markdown-it-attrs')
const mdAnchor = require('markdown-it-anchor')

const md = new MarkdownIt({ html: true, highlight })
const genId = content => content.replace(/\s+/g, '').replace(EMOJI_REG, '')

md.use(mdContainer)
md.use(mdAttrs)
md.use(mdAnchor, {
  slugify: genId,
  level: [2],
  permalink: true, 
  permalinkClass: 'article-anchor',
  permalinkBefore: true
})
  
md.renderer.rules.heading_open = function(tokens, idx, options, env, slf){
  const token = tokens[idx]
  const next = tokens[idx + 1]

  if(null != token && token.tag == 'h2' && null != next){
    token.attrJoin('class', 'head-anchor')
    token.attrSet('id', genId(next.content))
  }

  return slf.renderToken(tokens, idx, options)
}

module.exports = md