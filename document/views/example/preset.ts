import { getCurrentInstance, inject, provide, Ref } from 'vue'
import { useNotification } from '@document/component'
import { TYPE, config, DEAFULT_TARGET, ConfirmFunc, NotifyFunc, Config } from './config'

const LOCAL_PRESET_NAME_KEY = 'preset_name'
const UI_LIBARY_PROVIDE_KEY = 'ui-libary-target'

function findNode(link: string, type: number){
  const selector = (
    type == TYPE.STYLE 
      ? `link[rel="stylesheet"][href="${link}"]`
      : `script[src="${link}"]`
  )
  
  return document.querySelector(selector)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

function getTarget(target?: string){
  const name = target ?? getLocalPresetName()
  return config.has(name) ? name : DEAFULT_TARGET
}

function getLocalPresetName(){
  try {
    return localStorage.getItem(LOCAL_PRESET_NAME_KEY)
  } catch (error) {
    return DEAFULT_TARGET
  } 
}

export function savePresetNameToLocal(value: string){
  localStorage.setItem(LOCAL_PRESET_NAME_KEY, value)
}

function createPresetInfo(config: Config){
  return {
    id: config.id,
    name: config.name,
    version: config.version,
    homepage: config.homepage,
    IS_DEV: config.IS_DEV === true,
    show: config.IS_DEV != true || config.IS_DEV === true && __IS_DEV__ 
  }
}

export function usePreset(loading: Ref<boolean>){
  const instance = getCurrentInstance()
  const target = getTarget()
  const current = config.get(target)
  
  async function use(){
    loading.value = true

    await loadSource(current.source)
    const preset = await current.factory()
    current.install(preset, instance)

    document.querySelector('#loading')?.remove()
    loading.value = false
  }

  provide(UI_LIBARY_PROVIDE_KEY, target)

  return {
    use,
    libs: [...config.values()].map(createPresetInfo),
    ...createPresetInfo(current),
  }
}

export function useTarget(){
  return inject<string>(UI_LIBARY_PROVIDE_KEY)
}

export function useDesignerToolSlot(target: string, state: any){
  const current = config.get(target)
  const slot = current.renderDesignerToolSlot

  return typeof slot == 'function' ? slot.bind(null, state) : function(){
    return null as any
  }
}

export function useBuilderFooterSlot(target: string, state: any){
  const current = config.get(target)
  const slot = current.renderBuilderFooterSlot

  return typeof slot == 'function' ? slot.bind(null, state) : function(){
    return null as any
  }
}

export function useBuilderDefaultSlot(target: string, state: any){
  const current = config.get(target)
  const slot = current.renderBuilderDefaultSlot

  return typeof slot == 'function' ? slot.bind(null, state) : function(){
    return null as any
  }
}

export function useConfirm(target: string): ConfirmFunc{
  const current = config.get(target)
  const fn = current.confirm
  return typeof fn == 'function' ? fn : function(field){
    return Promise.resolve(window.confirm(`确定要删除字段[${field.title}]?`))
  }
}

export function useNotify(target: string): NotifyFunc{
  const current = config.get(target)
  const fn = current.notify

  return typeof fn == 'function' ? fn : useNotification().notify
}