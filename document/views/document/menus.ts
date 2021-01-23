import { reactive } from 'vue'
import data, { MenuRaw } from '../../docs/index'

export enum MenuStatusEnum{
  INIT = 0,
  LOADING = 1,
  LOADED = 2
}

const MENU_RAW_MAP = data.reduce((acc, raw) => {
  if(raw.group !== true) acc.set(raw.path, raw)
  return acc
}, new Map<string, MenuRaw>())

const MENUS_DATA = data.map(i => {
  return {
    name: i.name,
    group: i.group === true,
    path: i.path,
    subtitle: i.subtitle,
    status: MenuStatusEnum.INIT,
    hidden: i.hidden === true
  }
})

const PURE_MENU = MENUS_DATA.filter(i => i.group !== true && i.hidden !== true)
export const menus = reactive(MENUS_DATA.filter(i => i.hidden !== true))

export function load(path: string){
  const raw = MENU_RAW_MAP.get(path)
  if(null == raw) return Promise.resolve()

  const fn = raw.document
  return typeof fn == 'function' ? fn().then(m => m.default) : Promise.resolve()
}

export function getMenu(path: string){
  return MENUS_DATA.find(m => m.path == path)
}

export function getMenuRelation(path: string){
  const index = PURE_MENU.findIndex(m => m.path == path)
  const max = PURE_MENU.length - 1
  if(index < 0 || index > max) return null

  return {
    prev: index == 0 ? null : PURE_MENU[index - 1],
    next: index == max ? null : PURE_MENU[index + 1]
  }
}

export default {
  menus,
  load,
  getMenu
}
