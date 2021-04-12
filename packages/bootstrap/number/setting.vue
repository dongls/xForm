<template>
  <field-setting :field="field">
    <template #attributes>
      <div class="custom-control custom-checkbox custom-control-inline" title="勾选则只允许输入整数">
        <input :id="`${field.name}-integer`" :name="`${field.name}-integer`" :checked="field.attributes.integer" type="checkbox" class="custom-control-input" @change="updateField($event, 'integer', 'attributes')">
        <label class="custom-control-label" :for="`${field.name}-integer`">整数</label>
      </div>
    </template>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import { updateField } from '../util'
import FieldSetting from '../FieldSetting.vue'

export default defineComponent({
  name: 'xform-bs-number-setting',
  props: {
    field: FormField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    return { updateField: updateField.bind(null, emit) }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>
