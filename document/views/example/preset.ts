import { reset } from '@dongls/xform'

enum TYPE {
  STYLE = 1,
  SCRIPT = 2
}

const publicPath = __IS_DEV__ ? '/docs' : '/xForm'
const DEF_PRESEt = 'bootstrap'
const LOCAL_PRESET_NAME_KEY = '__xform_preset_name__'

const MODES = {
  example: [
    {
      title: '基础字段',
      types: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date']
    },
    {
      title: '辅助字段',
      types: ['divider', 'group', 'tabs', 'subform']
    }
  ],
  simple: ['text', 'textarea', 'number', 'select']
}

const CONFIGS: any = {
  'bootstrap': {
    source: [
      [publicPath + '/libs/bootstrap/bootstrap.min.css', TYPE.STYLE],
      [publicPath + '/libs/bootstrap/jquery.slim.min.js', TYPE.SCRIPT],
      [publicPath + '/libs/bootstrap/popper.min.js', TYPE.SCRIPT],
      [publicPath + '/libs/bootstrap/bootstrap.min.js', TYPE.SCRIPT]
    ],
    factory(){
      return import(/* webpackPrefetch: true */ '../../../packages/bootstrap').then(r => r.default)
    }
  },
  'antdv': {
    source: [
      [publicPath + '/libs/antdv/antd.min.css', TYPE.STYLE],
      [publicPath + '/libs/antdv/antd.min.js', TYPE.SCRIPT],
    ],
    factory(){
      return import(/* webpackPrefetch: true */ '../../../packages/antdv').then(r => r.default)
    }
  }
}

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

function getTarget(target: string){
  if(target in CONFIGS) return target

  const name = getLocalPresetName()
  return name in CONFIGS ? name : DEF_PRESEt
}

function getLocalPresetName(){
  try {
    return localStorage.getItem(LOCAL_PRESET_NAME_KEY)
  } catch (error) {
    return DEF_PRESEt
  } 
}

export function savePresetNameToLocal(value: string){
  localStorage.setItem(LOCAL_PRESET_NAME_KEY, value)
}

export async function usePreset(state: { preset: string, loading: boolean }, _target?: string){
  const target = getTarget(_target)
  if(target == state.preset) return

  const config = CONFIGS[target]

  state.loading = true
  const preset = await config.factory()

  const old = CONFIGS[state.preset]
  if(null != old) removeSource(old.source)
  await loadSource(config.source)
  
  reset({
    preset,
    config: { 
      modes: MODES
    }
  })

  state.preset = target
  state.loading = false
}