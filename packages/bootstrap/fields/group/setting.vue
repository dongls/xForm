<template>
  <field-setting :field="field" :placeholder="false" :required="false">
    <template #attributes>
      <div class="form-check form-check-inline" title="勾选则支持展开/收起分组">
        <input 
          :id="`${field.name}-collapsable`" 
          :name="`${field.name}-collapsable`" 
          :checked="field.attributes.collapsable" 
          type="checkbox" 
          class="form-check-input" 
          @input="updateField($event, 'collapsable', 'attributes')"
        >
        <label class="form-check-label" :for="`${field.name}-collapsable`">允许收起</label>
      </div>
    </template>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { updateField } from '@bootstrap/util'

import FieldSetting from '@bootstrap/FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-bs-group-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(props, { emit }){
    return { 
      updateField: updateField.bind(null, emit) 
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>