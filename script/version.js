const fs = require('fs');
const path = require('path');

process.argv.slice(2).forEach(item => {
  if(/RELEASE_VERSION=/.test(item)) {
    process.env.RELEASE_VERSION = item.trim().split('=')[1]
  }
})

// 更新src/index.js中的version
const filePath = path.resolve(__dirname, '../src/index.js');
const file = fs.readFileSync(filePath).toString();
const newJS = file.replace(/const\s+XForm\s+=\s+\{[\s\S]*version:\s*'(.*)'[^\\}]*\}/, function(match, $1){
  return match.replace($1, process.env.RELEASE_VERSION)
})

fs.writeFileSync(filePath, newJS);