import { XFieldConf, constant, XField, useRenderContext } from '@dongls/xform'
import { defineComponent, Fragment } from 'vue'
// import { updateField } from '../util'

const { CLASS, PROPS, EnumBehavior } = constant
const BODY_CLASS = 'xform-bs-subform-columns'
// TODO: 设置列宽
export default XFieldConf.create({
  type: 'subform',
  title: '子表单',
  accept: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date'],
  setting: defineComponent({
    name: 'xform-bs-subform-setting',
    props: {
      field: {
        type: XField,
        required: true,
      },
    },
    emits: [ 'update:field' ],
    setup(props){
      function updateTitle(f: XField, event: Event) {
        f.title = (event.target as HTMLInputElement).value
      }

      return function(){
        const field = props.field

        return (
          <Fragment>
            <h3 class="xform-setting-head">子表单</h3>
            <section class="xform-setting">
              <header>标题：</header>
              <input
                value={field.title}
                type="text"
                class="form-control form-control-sm"
                placeholder="请输入标题..."
                onInput={updateTitle.bind(null, field)}
              />
            </section>
          </Fragment>
        )
      }
    }
  }),
  build: defineComponent({
    name: 'xform-bs-subform',
    props: {
      field: {
        type: XField,
        required: true,
      },
      behavior: {
        type: String,
        default: null,
      }
    },
    setup(props){
      const rc = useRenderContext()
      return function(){
        const fields = props.field.fields
        const inDesigner = props.behavior == EnumBehavior.DESIGNER
        const klass = {
          'xform-bs-subform': true,
          [CLASS.IS_VERTICAL_MARK]: true,
          [CLASS.IS_SCROLL]: true,
        }

        const content = (
          inDesigner && fields.length == 0 
            ? <p class={[CLASS.IS_EMPTY_TIP, 'xform-bs-empty-tip']}>请将左侧控件拖动到此处</p>
            : (
              fields.map(f => {
                return rc.renderField(f, {
                  render: () => <div class="xform-bs-subform-col">{f.title}</div>
                })
              })
              
            )
        )

        const _p = {
          class: {
            [BODY_CLASS]: true,
            [CLASS.DROPPABLE]: inDesigner,
            [CLASS.SCOPE]: true
          },
          [PROPS.XFIELD]: inDesigner ? props.field : undefined,
          [PROPS.SCOPE]: props.field
        }
        
        return (
          <div class={klass}>
            <div {..._p}>{content}</div>
          </div>
        )
      }
    }
  }),
  onDragOver(event) {
    const current = event.currentTarget
    if(!current.matches('.' + BODY_CLASS) || Array.isArray(this.accept) && !this.accept.includes(event.context.fieldType)) return
    
    event.stopPropagation()
    event.preventDefault()

    const { directionX, moveMarkEl, getRootScopeEl } = event.context
    const isMockDef = event.dragElement.contains(current)
    const target = isMockDef ? event.dragElement : event.target
    const scope = isMockDef ? getRootScopeEl() : current

    moveMarkEl(directionX, target, scope)
  },
  onDrop(event) {
    event.stopPropagation()
  }
})