<template>
  <xform-setting :field="field" :placeholder="false" :required="false">
    <template #properties>
      <div class="custom-control custom-checkbox custom-control-inline">
        <input 
          :id="`${field.name}-collapsable`" 
          :name="`${field.name}-collapsable`" 
          :checked="field.attributes.collapsable" 
          type="checkbox" 
          class="custom-control-input" 
          @input="updateField($event, 'collapsable', 'attributes')"
        >
        <label class="custom-control-label" :for="`${field.name}-collapsable`">允许展开/收起</label>
      </div>
    </template>
  </xform-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import { updateField } from '../util'

export default defineComponent({
  name: 'xform-bs-group-setting',
  props: {
    field: XField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    return { 
      updateField: updateField.bind(null, emit) 
    }
  }
})
</script>