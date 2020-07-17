<script lang="ts">
import { useLocalSchema } from '../util/common'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'designer-view',
  setup(){
    const { schema, schemaJSON, reset } = useLocalSchema()    
    return {
      schema,
      schemaJSON,
      reset,
      viewJson(){
        this.$emit('view', { title: 'Field JSON', json: schemaJSON })
      }
    }
  }
})
</script>

<template>
  <xform-designer v-model:schema="schema" mode="example">
    <template #tool>
      <div class="designer-tool">
        <button type="button" class="btn btn-link btn-text btn-sm" @click="reset">清空</button>
        <button type="button" class="btn btn-link btn-text btn-sm" @click="viewJson">查看JSON</button>
      </div>
    </template>
    <!-- <template #setting="scope">
      <div>test setting: {{ scope.value }}</div>
    </template> -->
    <!-- <template #setting_type_text="scope">
      <div >field setting: {{ scope }}</div>
    </template> -->
  </xform-designer>
</template>

<style lang="scss">
$--xform-color-primary: #409EFF !default;

.designer-tool{
  text-align: right;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
  line-height: 38px;
  height: 38px;
}
</style>