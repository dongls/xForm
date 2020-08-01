import { store } from '@core/index'
import Bootstrap from '@packages/bootstrap'

enum TYPE {
  STYLE = 1,
  SCRIPT = 2
}

const MODES = {
  example: [
    {
      title: '基础字段',
      types: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date']
    },
    {
      title: '辅助字段',
      types: ['divider', 'group']
    }
  ],
  simple: ['text', 'textarea', 'number', 'select']
}

const CONFIGS = {
  'bootstrap': {
    source: [
      ['https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css', TYPE.STYLE],
      ['https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js', TYPE.SCRIPT],
      ['https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js', TYPE.SCRIPT],
      ['https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.min.js', TYPE.SCRIPT]
    ],
    factory(){
      return Promise.resolve(Bootstrap)
    }
  },
  'antdv': {
    source: [],
    factory(){
      return Promise.resolve(null)
    }
  }
} as any

function findNode(link: string, type: number){
  const selector = (
    type == TYPE.STYLE 
      ? `link[rel="stylesheet"][href="${link}"]`
      : `script[src="${link}"]`
  )
  
  return document.querySelector(selector)
}

function removeSource(source: any){
  if(!Array.isArray(source)) return

  for(const arr of source){
    const [link, type]= arr
    const node = findNode(link, type)

    if(node != null) node.remove()
  }
}

function loadSource(source: any){
  if(!Array.isArray(source)) return Promise.resolve()

  const promises = source.map(arr => createNode(arr[0], arr[1]))
  return Promise.allSettled(promises)
}

function createNode(link: string, type: number){
  if(type == TYPE.STYLE) return createStyle(link)
  if(type == TYPE.SCRIPT) return createScript(link)

  return Promise.resolve()
}

function createStyle(link: string){
  if(null != findNode(link, TYPE.STYLE)) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const node = document.createElement('link')
    node.rel = 'stylesheet'
    node.href = link
    node.onload = resolve
    node.onerror = reject

    document.head.insertBefore(node, document.head.children[0])
  })
}

function createScript(link: string){
  if(null != findNode(link, TYPE.SCRIPT)) return Promise.resolve()
  
  return new Promise((resolve, reject) => {
    const node = document.createElement('script')
    node.src = link
    node.async = false
    node.onload = resolve
    node.onerror = reject

    document.head.insertBefore(node, document.head.children[0])
  })
}

export async function usePreset(target: string, state: { preset: string, key: number, loading: boolean }){
  if(target == state.preset) return

  const config = CONFIGS[target]
  if(null == config) return

  state.loading = true
  const preset = await config.factory()

  const old = CONFIGS[state.preset]
  if(null != old) removeSource(old.source)
  await loadSource(config.source)
  
  store.reset({
    preset,
    config: { modes: MODES }
  })

  state.preset = target
  state.key++
  state.loading = false
}