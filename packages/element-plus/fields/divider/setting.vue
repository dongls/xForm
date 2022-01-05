<template>
  <field-setting :field="field" :placeholder="false" :attributes="false">
    <section class="xform-el-field-setting-prop xform-divider-types">
      <header>样式：</header>
      <el-radio 
        v-for="type in types" :key="type" 
        v-model="compatType"
        name="setting-divider-type" :label="type"
      >
        <xform-divider :type="type"/>
      </el-radio>
    </section>

    <section class="xform-el-field-setting-prop">
      <header>间距：</header>
      <div class="xform-el-divider-range">
        <label>上间距：</label>
        <el-slider v-model="compatTop" :min="0" :max="100" :step="5" show-stops/>
      </div>
      <div class="xform-el-divider-range">
        <label>下间距：</label>
        <el-slider v-model="compatBottom" :min="0" :max="100" :step="5" show-stops/>
      </div>
    </section>
  </field-setting>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FormField, useConstant } from '@dongls/xform'
import { useFieldProp } from '@common/util'

import divider from '@common/components/divider.vue'
import FieldSetting from '@element-plus/FieldSetting.vue'

const { EVENTS } = useConstant()

export default defineComponent({
  name: 'xform-el-divider-setting',
  props: {
    field: FormField
  },
  emits: [EVENTS.UPDATE_FIELD],
  setup(){
    return {
      types: ['solid', 'dashed', 'double', 'solid-dashed', 'dashed-solid'],
      compatType: useFieldProp('type', 'attributes'),
      compatTop: useFieldProp('top', 'attributes'),
      compatBottom: useFieldProp('bottom', 'attributes'),
    }
  },
  components: {
    [divider.name]: divider,
    [FieldSetting.name]: FieldSetting
  }
})
</script>

<style lang="scss">
.xform-divider-types .el-radio{
  display: flex;
  align-items: center;
  margin: 0;
}

.xform-divider-types .el-radio__label{
  flex: 1;
}

.xform-el-divider-range{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .el-slider{
    flex: 1;
    margin-right: 10px;
    margin-left: 10px;
  }

  label{
    width: 64px;
  }
}


</style>