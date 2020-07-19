const blocks = require('markdown-it/lib/common/html_blocks');

[
  'md-meta', 
  'code-box'
].forEach(b => blocks.push(b))
