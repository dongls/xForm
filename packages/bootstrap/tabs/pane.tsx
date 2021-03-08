import { defineComponent } from 'vue'

import {
  XField,
  XFieldConf,
  constant,
  useContext,
} from '@dongls/xform'

const { SELECTOR, CLASS } = constant

export default XFieldConf.create({
  type: 'tabs.pane',
  title: '标签面板',
  custom: true,
  scoped: true,
  build: defineComponent({
    name: 'tabs-pane',
    props: {
      field: {
        type: XField,
        required: true,
      },
      behavior: {
        type: String,
        default: null,
      },
    },
    setup(props) {
      return function () {
        const context = useContext()
        const field = props.field
        const fields = field.fields

        const tip =
          props.behavior == 'designer' && fields.length == 0 ? (
            <p class={[CLASS.IS_EMPTY_TIP, 'xform-bs-empty-tip']}>请将左侧控件拖动到此处</p>
          ) : null

        return (
          <div class="tab-pane">
            {tip}
            {fields.map((f) => context.renderField(f))}
          </div>
        )
      }
    },
  }),
  view: defineComponent({
    name: 'tabs-pane-view',
    props: {
      field: {
        type: XField,
        required: true,
      },
    },
    setup(props) {
      const context = useContext()

      return function () {
        const fields = props.field.fields
        return (
          <div class="tab-pane">
            {fields.map((f) => context.renderField(f))}
          </div>
        )
      }
    },
  }),
  onDragOver(event) {
    const current = event.currentTarget
    
    event.stopPropagation()
    event.preventDefault()

    const { directionY, moveMarkEl } = event.context
    const isMockDef = event.dragElement.contains(current)
    const target = isMockDef ? event.dragElement : event.target
    const scope = isMockDef ? event.dragElement.parentElement.closest(SELECTOR.DROPPABLE) : current

    moveMarkEl(directionY, target, scope)
  },
  onDrop(event) {
    event.stopPropagation()
  }
})
