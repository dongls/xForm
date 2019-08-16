import {clonePlainObject, mergePlainObject, findProp} from '@src/util/lang';

import XFieldType from '../model/XFieldType'
import config from '../config';

const state = {
  config: clonePlainObject(config),     // 全局配置
  types: {}       // 字段类型
}

/**
 * 使用一个字段库
 * @param {object} lib - 字段库 
 * @param {object[]} lib.types - 字段类型
 * @param {object} lib.config - 配置
 */
export function use(lib){
  setConfig(lib.config);
  register(Object.keys(lib.types).map(key => lib.types[key]));
}

/**
 * 设置全局配置
 * @param {object} o - 配置对象 
 */
export function setConfig(o = {}){
  const clone = clonePlainObject(o);
  state.config = mergePlainObject(state.config, clone);
}

/**
 * 查询多个路径下第一个不为null或undefined的配置
 * @param  {...string} paths - 任意个配置路径
 * @returns 返回第一个不为null的值
 */
export function findConfigProp(...paths){
  for(let i = 0; i < paths.length; i++){
    const path = paths[i];
    const value = findProp(state.config, path);

    if(null != value) return value;
  }

  return null;
}

/** 注册任意个字段 */
export function register(...args){
  if(args.length <= 0) return;

  args
    .reduce((acc, val) => (Array.isArray(val) ? acc = acc.concat(val) : acc.push(val)) && acc, [])
    .map(o => new XFieldType(o))
    .filter(f => f.available)
    .forEach(ft => {
      state.types[ft.type] = ft;
    });
}

/** 
 * 查询某字段的字段结构
 * @param {string} type -- 字段类型
 * @returns {XFieldType} 字段类型配置
 */
export function findFieldType(type){
  return state.types[type];
}

/** 
 * 查询某字段的字段结构
 * @param {...*} args -- 字段类型
 * @returns {XFieldType[]} 字段类型配置
 */
export function findFieldTypes(...args){
  let types = args
    .reduce((acc, val) => (Array.isArray(val) ? acc = acc.concat(val) : acc.push(val)) && acc, [])
    .filter(t => null != t);

  if(types.length == 0) types = Object.keys(state.types);
  return types.map(t => state.types[t]).filter(t => null != t);
}

/**
 * 查询某mode下所有字段的配置, 必定返回数组 
 * @param {string} mode - mode name
 * @returns {XFieldType[]} 
 */
export function findMode(mode){  
  const arr = findProp(state.config, `modes.${mode}`);
  if(!Array.isArray(arr)) return [];

  return arr.filter(i => null != i);
}

export default {
  use,
  register,
  setConfig,
  findConfigProp,
  findFieldType,
  findFieldTypes,
  findMode
};