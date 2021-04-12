import './index.scss'

import { genRandomStr } from '@dongls/xform'
import { App, createApp, defineComponent, VNode } from 'vue'

type Options = {
  delay?: number;
  title?: string;
  content?: VNode;
  message?: string;
}

const stack: string[] = []

function genTop(num: number){
  if(num < 0) return 10
  const id = stack[num]
  const element = document.querySelector(`#${id}`) as HTMLElement

  return element.offsetTop + element.offsetHeight + 10
}

function createMounted(id: string){
  const element = document.createElement('div')
  element.id = id
  element.className = 'notification-layout'
  element.dataset.placement = 'top-right'
  element.style.top = genTop(stack.length - 1) + 'px'

  stack.push(id)
  document.body.appendChild(element)
  return element
}

function updateLayout(){
  stack.forEach((id, index) => {
    const element = document.querySelector(`#${id}`) as HTMLElement
    element.style.top = genTop(index - 1) + 'px'
  })
}

const Notification = defineComponent({
  props: {
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    function close(){
      emit('close')
    }

    return function(){
      const content = typeof slots.default == 'function' ? slots.default() : props.message
    
      return (
        <div class="notification">
          <h3 class="notification-title">{props.title ?? '提示'}</h3>
          <div class="notification-content">{content}</div>
          <button class="notification-close" type="button" onClick={close}>×</button>
        </div>
      )
    }
  }
})

export function useNotification(){
  function notify(options: Options = {}){
    const id = `notification-${genRandomStr()}`
    const element = createMounted(id)
    const instance = createApp({
      setup(){
        return function(){
          const slots = {} as any
          if(options.content) slots.default = () => options.content

          const props = {
            title: options.title,
            message: options.message,
            'onClose': () => instance.close()
          }

          return <Notification {...props} v-slots={slots}/>
        }
      }
    }) as App<Element> & { timer: any, close: any }

    const close = function(){
      if(instance.timer){
        clearTimeout(instance.timer)
        instance.timer = null
      }

      instance.unmount()
      instance.close = null
      document.body.removeChild(element)

      const index = stack.indexOf(id)
      if(index >= 0) stack.splice(index, 1) 

      updateLayout()
    }

    instance.close = close
    instance.mount(element, true)
    if(options.delay !== 0){
      instance.timer = setTimeout(close, options.delay ?? 3000)
    }

    return close
  }

  return {
    notify
  }
}

export default Notification