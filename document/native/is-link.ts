import icon from '!!raw-loader!../assets/svg/outbound.svg'

class IconOutbound extends HTMLElement {
  constructor(){
    super()

    this.innerHTML = icon
    this.title = '查看详情'

    this.addEventListener('click', function(){
      const path = this.getAttribute('path')
      window.open(window.location.origin + path)
    })
  }
}


export default {
  install(){
    customElements.define('is-link', IconOutbound)
  }
} 