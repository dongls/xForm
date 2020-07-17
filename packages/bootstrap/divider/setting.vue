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
    <div class="custom-control custom-radio">
      <input id="divider-solid" name="setting-divider-type" type="radio" value="solid" class="custom-control-input" :checked="field.attributes.type == 'solid'" @change="update('type', 'solid', 'attributes')">
      <label class="custom-control-label" for="divider-solid">
        <xform-divider type="solid"/>
      </label>
    </div>
    <div class="custom-control custom-radio">
      <input id="divider-dashed" name="setting-divider-type" type="radio" value="dashed" class="custom-control-input" :checked="field.attributes.type == 'dashed'" @change="update('type', 'dashed', 'attributes')">
      <label class="custom-control-label" for="divider-dashed">
        <xform-divider type="dashed"/>
      </label>
    </div>
    <div class="custom-control custom-radio">
      <input id="divider-double" name="setting-divider-type" type="radio" value="double" class="custom-control-input" :checked="field.attributes.type == 'double'" @change="update('type', 'double', 'attributes')">
      <label class="custom-control-label" for="divider-double">
        <xform-divider type="double"/>
      </label>
    </div>
    <div class="custom-control custom-radio">
      <input id="divider-solid-dashed" name="setting-divider-type" type="radio" value="solid-dashed" class="custom-control-input" :checked="field.attributes.type == 'solid-dashed'" @change="update('type', 'solid-dashed', 'attributes')">
      <label class="custom-control-label" for="divider-solid-dashed">
        <xform-divider type="solid-dashed"/>
      </label>
    </div>
    <div class="custom-control custom-radio">
      <input id="divider-dashed-solid" name="setting-divider-type" type="radio" value="dashed-solid" class="custom-control-input" :checked="field.attributes.type == 'dashed-solid'" @change="update('type', 'dashed-solid', 'attributes')">
      <label class="custom-control-label" for="divider-dashed-solid">
        <xform-divider type="dashed-solid"/>
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