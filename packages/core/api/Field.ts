import { FieldConf, ModeGroup } from '../model'
import { flat, isEmpty, isNull } from '../util'
import { store } from './Store'

const DELIMITER = '.'

/** 注册字段 */
export function registerField(...fcs: Array<FieldConf | FieldConf[]>){
  flat(fcs).forEach(fc => {
    if(fc instanceof FieldConf && fc.available){
      store.fields.set(fc.type, fc)
    }
  })
}

export function removeField(field: FieldConf){
  const type = field.type
  const exist = store.fields.get(type)
  if(exist === field) store.fields.delete(type)
}

/** 删除所有已注册字段 */
export function resetField(){
  store.fields.clear()
}

/** 检测是否已注册字段类型 */
export function hasField(type: string){
  return store.fields.has(type)
}

/** 查找字段类型 */
export function findField(path: string){
  if(isNull(path) || isEmpty(path)) return null

  const index = path.indexOf(DELIMITER)
  const type = index >= 0 ? path.slice(0, index) : path
  const fc = store.fields.get(type)
  
  if(isNull(fc)) {
    if(__IS_DEV__) console.warn(`[xform]: 请先注册字段类型[${type}]`)
    return null
  }

  if(index < 0) return fc
  const dep = fc.dependencies.find(f => f.type == path)
  if(isNull(dep)){
    if(__IS_DEV__) console.warn(`[xform]: 请先注册字段类型[${path}]`)
    return null
  }

  return dep
}

/** 查找`mode`对应的所有字段，如果没有配置则返回所以字段 */
function findMode(mode?: string){
  // 默认显示所有字段
  if(mode == null || null == store.config.modes) return Array.from(store.fields.keys())

  const types = store.config.modes[mode]
  return Array.isArray(types) ? types.filter(t => null != t) : []
}

/** 以分组的形式查找`mode`对应的所有字段 */
export function findModeGroup(mode?: string){
  const data = findMode(mode)
  if(data.length == 0) return []

  const groups = (typeof data[0] != 'object' ? [{ types: data }] : data) as ModeGroup[]
  for(const g of groups) g.fieldConfs = g.types.map(findField).filter(f => f && f.available)
  return groups
}