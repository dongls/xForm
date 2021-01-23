import css from '!!raw-loader!postcss-loader!./index.css'
import codegen from './codegen'

function goCodepen(code: string, event: Event){
  const data = codegen(code)

  // https://blog.codepen.io/documentation/prefill/
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = 'https://codepen.io/pen/define/'
  form.target = '_blank'
  form.style.display = 'none'

  const input = document.createElement('input')
  input.name = 'data'
  input.type = 'hidden'
  input.value = JSON.stringify(data)

  form.appendChild(input)
  document.body.appendChild(form)

  form.submit()
  setTimeout(() => form.remove(), 150)
}

function createOnline(code: string){
  const online = document.createElement('button')
  online.type = 'text'
  online.textContent = '在线运行'
  
  online.addEventListener('click', goCodepen.bind(null, code))

  return online
}

class CodeBox extends HTMLElement {
  constructor(){
    super()

    const code = this.querySelector('pre.hljs')
    const style = document.createElement('style')
    style.textContent = css
    
    const online = createOnline(code.textContent)

    const toolbox = document.createElement('div')
    toolbox.className = 'toolbox'
    toolbox.appendChild(online)

    const root = document.createElement('div')
    root.className = 'code-box-root'
    root.appendChild(code)
    root.appendChild(toolbox)

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(style)
    shadow.appendChild(root)
  }
}


export default {
  install(){
    customElements.define('code-box', CodeBox)
  }
} 