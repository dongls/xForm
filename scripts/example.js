const path = require('path')
const fs = require('fs')

const BASE_PATH = path.resolve(__dirname, '../example')
const OUTPUT_BASE_PATH = BASE_PATH + '/packages'

if(!fs.existsSync(OUTPUT_BASE_PATH)) {
  process.env.OUTPUT_BASE_PATH = OUTPUT_BASE_PATH
  require('./utils').buildCode()
}

const files = fs.readdirSync(BASE_PATH).filter(name => name.endsWith('.html'))
const links = files.map(f => `<a href="/example/${f}" target="main">${f}</a>`).join('')
const html = `
<html>
  <head><link rel="stylesheet" href="/example/index.css"/></head>
  <body><aside>${links}</aside><iframe name="main"></iframe></body>
</html
`

const chalk = require('chalk')
const express = require('express')
const app = express()
const port = 8802

app.use('/example', express.static('example'))
app.use('/libs', express.static('docs/libs'))
app.get('/', (req, res) => res.send(html))

app.listen(port, () => {
  const link = chalk.green.bold(`http://localhost:${port}`)
  const arrow = chalk.green.bold('➜')
  console.log(arrow + '  example running at ' + link)
})
