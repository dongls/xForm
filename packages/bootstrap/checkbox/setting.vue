<template>
  <field-setting :field="field" :placeholder="false">
    <section class="xform-bs-field-setting-prop">
      <header>布局：</header>
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary" :class="{'active': field.attributes.layout == 'inline' }" @click="update('layout', 'inline', 'attributes')"> 行内 </button>
        <button type="button" class="btn btn-sm btn-primary" :class="{'active': field.attributes.layout == 'block'}" @click="update('layout', 'block', 'attributes')"> 换行 </button>
      </div>
    </section>

    <section class="xform-bs-field-setting-prop">
      <header>选项：</header>
      <div 
        v-for="(option, i) in field.options" :key="i"
        class="xform-bs-setting-option"
      >
        <input :value="option.value" class="form-control form-control-sm" placeholder="请输入选项内容" @input="updateOption($event, option)">
        <button type="button" class="btn btn-link text-danger" @click="removeOption(option)" :disabled="field.options.length <= 1">删除</button>
      </div>
      <button type="text" class="btn btn-link btn-sm bs-btn-text" @click="addOption">添加选项</button>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField } from '@dongls/xform'
import FieldSetting from '../FieldSetting.vue'

export default defineComponent({
  name: 'xform-bs-checkbox-setting',
  props: {
    field: FormField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    function update(prop: string, value: any, scope?: string){
      emit('update:field', { prop, value, scope })
    }

    return {
      update,
      updateField(event: Event, prop: string, scope?: string){
        const target = event.target as HTMLInputElement
        let value: any = target.value
        if(target.type == 'checkbox') value = target.checked

        update(prop, value, scope)
      },
      addOption(){
        const options = props.field.options
        options.push({ value: `选项${options.length + 1}` })
        update('options', options)
      },
      updateOption(event: Event, option: any){
        const target = event.target as HTMLInputElement
        const value: any = target.value

        option.value = value
        update('options', props.field.options)
      },
      removeOption(option: any){
        if(props.field.options.length <= 1) return

        const options = props.field.options
        const index = options.indexOf(option)
        if(index >= 0) options.splice(index, 1)

        update('options', options)
      }
    }
  },
  components: {
    [FieldSetting.name]: FieldSetting
  }
})
</script>
