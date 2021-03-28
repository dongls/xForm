import { defineComponent } from 'vue'
import { isFunction } from '../../util'
import { XField } from '../../model'

function createTitle(field: XField){
  return (
    <section class="xform-setting">
      <header>标题：</header>
      <input type="text" class="form-control form-control-sm" placeholder="请输入标题..." v-model={field.title}/>
    </section>
  )
}

function createPlaceholder(field: XField){
  return (
    <section class="xform-setting">
      <header>提示：</header>
      <textarea class="form-control form-control-sm" placeholder="请输入提示信息..." rows={3} v-model={field.placeholder}/>
    </section>
  )
}

function createRequired(field: XField){
  return (
    <div class="custom-control custom-checkbox custom-control-inline" title="勾选则该字段在表单提交时必须填写">
      <input id={`${field.name}-required`} name={`${field.name}-required`} type="checkbox" class="custom-control-input" v-model={field.required}/>
      <label class="custom-control-label" for={`${field.name}-required`}>必填</label>
    </div>
  )
}

function createDisabled(field: XField){
  return (
    <div class="custom-control custom-checkbox custom-control-inline" title="勾选则该字段在表单中无法编辑, 也不参与表单验证">
      <input id={`${field.name}-disabled`} name={`${field.name}-disabled`} type="checkbox" class="custom-control-input" v-model={field.disabled}/>
      <label class="custom-control-label" for={`${field.name}-disabled`}>禁用</label>
    </div>
  )
}
function createHidden(field: XField){
  return (
    <div class="custom-control custom-checkbox custom-control-inline" title="勾选则该字段将不会再表单中显示">
      <input id={`${field.name}-hidden`} name={`${field.name}-hidden`} type="checkbox" class="custom-control-input" v-model={field.hidden}/>
      <label class="custom-control-label" for={`${field.name}-hidden`}>隐藏</label>
    </div>
  )
}
export default defineComponent({
  name: 'xform-setting',
  props: {
    field: {
      type: XField,
      required: true
    },
    placeholder: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots }){
    return function(){
      const field = props.field
      const title =  createTitle(field)
      const placeholder = props.placeholder ? createPlaceholder(field) : null
      const required =  props.required ? createRequired(field) : null
      const disabled = createDisabled(field)
      const hidden = createHidden(field)

      const properties = (
        <section class="xform-setting">
          <header>属性：</header>
          {required}{disabled}{hidden}
          {isFunction(slots.properties) && slots.properties()}
        </section>
      )

      return (
        <div class={`xform-${field.type}-setting`}>
          <h3 class="xform-setting-head">{field.conf.title}</h3>
          {title}
          {placeholder}
          {properties}
          { isFunction(slots.default) && slots.default() }
        </div>
      )
    }
  }
})