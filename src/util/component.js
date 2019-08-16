/**
 * 生成提示信息
 * @param {XFiled} field - 字段对象
 * @returns {string}
 */
export function genPlaceholder(field){
  if(null == field) return '';

  const prefix = field.required ? field.type == 'select' ? '[必选] ' : '[必填] ' : '';
  const placeholder = field.placeholder || '';
  return `${prefix}${placeholder}` || null;
}

/**
 * 触发一个自定义事件
 * @param {HTMLElement} target - 待触发事件的元素
 * @param {string} name - 事件名 
 * @param {object} detail - 携带的数据 
 * @param {boolean} async - 是否异步触发
 */
export function dispatchEvent(target, name, detail, async = false){
  let event = new CustomEvent(name, {detail, bubbles: true, cancelable: true})
  async ? setTimeout(() => target.dispatchEvent(event), 0) : target.dispatchEvent(event);
}

/**
 * 根据组件名匹配离当前元素最近的祖先元素
 * @param {VueComponent} component - 查找的组件 
 * @param {string} name - 组件名
 * @param {*} scope - 查找的范围
 * @returns 如果匹配，返回组件实例，否则返回`null` 
 */
export function closest(component, name, scope = ['xform-designer', 'xform-builder', 'xform-viewer']){
  if(null == component) return null;

  let root = component.$root;
  let parent = component.$parent;

  while(null != parent && parent != root){
    if(parent.$options.name == name) return parent;
    if(scope.indexOf(parent.$options.name) >= 0) return null;

    parent = parent.$parent;
  }

  return null;
}