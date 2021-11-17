<template>
  <field-setting :field="field" :placeholder="false" :attributes="false">
    <section class="xform-bs-field-setting-prop xform-divider-types">
      <header>样式：</header>
      <div v-for="type in types" :key="type" class="form-check">
        <input 
          :id="`divider-${type}`" name="setting-divider-type" 
          type="radio" :value="type" class="form-check-input" 
          :checked="field.attributes.type == type"
          @change="update('type', type, 'attributes')"
        >
        <label class="form-check-label" :for="`divider-${type}`">
          <xform-divider :type="type"/>
        </label>
      </div>
    </section>

    <section class="xform-bs-field-setting-prop">
      <header>间距：</header>
      <div class="xform-bs-divider-range">
        <label>上间距：</label>
        <input :value="field.attributes.top" type="range" class="form-range" min="0" max="100" step="5" @input="updateField($event, 'top', 'attributes')">
      </div>
      <div class="xform-bs-divider-range">
        <label>下间距：</label>
        <input :value="field.attributes.bottom" type="range" class="form-range" min="0" max="100" step="5" @input="updateField($event, 'bottom', 'attributes')">    
      </div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'

import divider from '../../common/components/divider.vue'
import FieldSetting from '../FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-bs-divider-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(props, { emit }){
    function update(prop: string, value: any, scope?: string){
      emit(EVENTS.UPDATE_FIELD, { prop, value, scope })
    }

    return {
      types: ['solid', 'dashed', 'double', 'solid-dashed', 'dashed-solid'],
      update,
      updateField(event: Event, prop: string, scope?: string){
        const target = event.target as HTMLInputElement
        const value = parseInt(target.value)
        update(prop, value, scope)
      }
    }
  },
  components: {
    [divider.name]: divider,
    [FieldSetting.name]: FieldSetting
  }
})
</script>

<style>
.xform-divider-types .form-check-input{
  margin-top: 9px;
}

.xform-divider-types .form-check-label{
  width: 100%;
  display: block;
}

.xform-bs-divider-range{
  display: flex;
  flex-flow: row nowrap;
  margin-top: 10px;
}

.xform-bs-divider-range label{
  width: 64px;
}

.xform-bs-divider-range .form-range{
  flex: 1;
}
</style>