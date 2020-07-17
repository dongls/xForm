<script lang="ts">
import { defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import divider from '../../common/components/divider.vue'

export default defineComponent({
  name: 'xform-bs-divider-setting',
  components: {
    [divider.name]: divider
  },
  props: {
    field: XField
  },
  emits: ['update:field'],
  setup(props, { emit }){
    function update(prop: string, value: any, scope?: string){
      emit('update:field', { prop, value, scope })
    }

    return {
      types: ['solid', 'dashed', 'double', 'solid-dashed', 'dashed-solid'],
      update,
      updateField(event: Event, prop: string, scope?: string){
        const target = event.target as HTMLInputElement
        let value: any = target.value
        if(target.type == 'checkbox') value = target.checked
        if(target.type == 'range') {
          const n = parseFloat(value)
          value = isNaN(n) ? value : n
        }
      
        emit('update:field', { prop, value, scope })
      },
      isChecked(type: string){
        return props.field.attributes.type == type || (type == 'solid' && props.field.attributes.type == null)
      }
    }
  }
})
</script>

<template>
  <h3 class="xform-setting-head">分割线</h3>

  <section class="xform-setting">
    <header>标题：</header>
    <input :value="field.title" type="text" class="form-control form-control-sm" placeholder="请输入标题..." @input="updateField($event, 'title')">
  </section>

  <section class="xform-setting xform-divider-types">
    <header>样式：</header>
    <div v-for="type in types" :key="type" class="custom-control custom-radio">
      <input 
        :id="`divider-${type}`" name="setting-divider-type" 
        type="radio" :value="type" class="custom-control-input" 
        :checked="isChecked(type)" @change="update('type', type, 'attributes')"
      >
      <label class="custom-control-label" :for="`divider-${type}`">
        <xform-divider :type="type"/>
      </label>
    </div>
  </section>

  <section class="xform-setting">
    <header>间距：</header>
    <div class="xform-bs-divider-range">
      <label>上间距：</label>
      <input :value="field.attributes.top" type="range" class="custom-range" min="0" max="100" step="5" @input="updateField($event, 'top', 'attributes')">
    </div>
    <div class="xform-bs-divider-range">
      <label>下间距：</label>
      <input :value="field.attributes.bottom" type="range" class="custom-range" min="0" max="100" step="5" @input="updateField($event, 'bottom', 'attributes')">    
    </div>
  </section>
</template>

<style>
.xform-divider-types .custom-control{
  display: flex;
  align-items: center;
}

.xform-divider-types .custom-control-label{
  flex: 1;
}

.xform-divider-types .custom-control-label::before,
.xform-divider-types .custom-control-label::after{
  top: 50%;
  transform: translateY(-50%);
}

.xform-bs-divider-range{
  display: flex;
  flex-flow: row nowrap;
  margin-top: 10px;
}


.xform-bs-divider-range label{
  width: 100px;
}
</style>