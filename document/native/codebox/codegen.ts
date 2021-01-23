const libs = {
  '@dongls/xform': 'XForm',
  '@dongls/xform.bootstrap': 'XForm.bootstrap',
  'vue': 'Vue'
} as { [prop: string]: string }

function getScript(content: string) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}

function getStyle(content: string) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/)
  return result && result[2] ? result[2].trim() : ''
}


function genhtml(code: string){
  const template = code.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim().replace(/^<template/, '<template id="template"')

  return [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css"/>',
    '<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.min.js"></script>',
    `<script src="https://unpkg.com/vue@${__VUE_VERSION__}/dist/vue.global.prod.js"></script>`,
    `<link href="https://unpkg.com/@dongls/xform@${__VERSION__}/dist/index.css" rel="stylesheet">`,
    `<script src="https://unpkg.com/@dongls/xform@${__VERSION__}/dist/index.js"></script>`,
    `<link href="https://unpkg.com/@dongls/xform.bootstrap@${__VERSION__}/dist/index.css" rel="stylesheet">`,
    `<script src="https://unpkg.com/@dongls/xform.bootstrap@${__VERSION__}/dist/index.js"></script>`,
    '<div id="app"></div>',
    template
  ].join('\n')
}

function genScript(code: string){
  const script = getScript(code)
    .replace(/export default {/, 'const component = { \n  template: "#template",')
    .replace(/import (.*) from ['"](.*)['"]/, function(match, p1, p2){
      return `const ${p1} = ${libs[p2]}`
    })
    
  return [
    script,
    '',
    'const option = { preset: XForm.bootstrap };',
    'const app = Vue.createApp(component);',
    'app.use(XForm, option);',
    'app.mount("#app")'
  ].join('\n')
}

function genCss(content: string){
  return [
    '#app{ height: 100vh; }',
    getStyle(content)
  ].join('\n')
}

export default function genCode(content: string){
  return { 
    js: genScript(content), 
    css: genCss(content), 
    html: genhtml(content) 
  }
}