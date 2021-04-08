<script lang="ts">
import { computed, defineComponent } from 'vue'
import { constant } from '@dongls/xform'

const { EVENTS, LabelPosition } = constant
const positions = Object.values(LabelPosition)

export default defineComponent({
  name: 'xform-bs-setting',
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  emits: [EVENTS.UPDATE_PROP],
  setup(props, { emit }){
    return {
      updateProp(prop: string, value: any){
        emit(EVENTS.UPDATE_PROP, { prop, value })
      },
      labelPosition: computed(() => {
        const value = props.schema.labelPosition
        return positions.includes(value) ? value : 'left'
      })
    }
  }
})
</script>

<template>
  <section class="xform-setting">
    <header>标题后缀：</header>
    <input :value="schema.labelSuffix" type="text" class="form-control form-control-sm" placeholder="请输入标题后缀..." @input="updateProp('labelSuffix', $event.target.value)">
  </section>
  <section class="xform-setting">
    <header>空值显示为：</header>
    <input :value="schema.viewerPlaceholder" type="text" class="form-control form-control-sm" placeholder="查看表单时如果值为空，则显示输入值" @input="updateProp('viewerPlaceholder', $event.target.value)">
  </section>
  <section class="xform-setting">
    <header>标题位置：</header>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-sm btn-primary" :class="{'active': labelPosition == 'left'}" @click="updateProp('labelPosition', 'left')">左对齐</button>
      <button type="button" class="btn btn-sm btn-primary" :class="{'active': labelPosition == 'top'}" @click="updateProp('labelPosition', 'top')">顶部对齐</button>
      <button type="button" class="btn btn-sm btn-primary" :class="{'active': labelPosition == 'right'}" @click="updateProp('labelPosition', 'right')">右对齐</button>
    </div>
  </section>
</template>