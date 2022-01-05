<template>
  <field-setting :field="field">
    <section class="xform-bs-field-setting-prop">
      <header>默认值：</header>
      <input type="text" class="form-control form-control-sm" v-model.number="compatValue" placeholder="[可选] 如果字段没有填写，默认为设定的值">
    </section>
    <template #attributes>
      <div class="form-check form-check-inline">
        <input :id="`${field.name}-integer`" :name="`${field.name}-integer`" type="checkbox" class="form-check-input" v-model="integer">
        <label class="form-check-label" :for="`${field.name}-integer`" title="勾选则只允许输入整数">整数</label>
      </div>
    </template>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useDefaultValueApi, useFieldProp } from '@bootstrap/util'

import FieldSetting from '@bootstrap/FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-bs-number-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    const dvApi = useDefaultValueApi([])

    return { 
      integer: useFieldProp('integer', 'attributes'),
      compatValue: dvApi.useCompatValue()
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>
