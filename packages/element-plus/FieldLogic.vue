<template>
  <div class="xform-el-field-setting-prop">
    <header>
      <span>逻辑：</span>
      <el-button type="primary" :class="classes.logicBtn" @click="showModal" link>配置</el-button>
    </header>
    <div :class="classes.tip">配置字段逻辑后，如果依赖的字段能够满足指定的条件，就会显示该字段，否则会隐藏该字段。</div>
    
    <el-dialog
      title="配置逻辑"
      v-model="visible"
      width="840px"
      :custom-class="classes.modal"
      destroy-on-close
      append-to-body
    >
      <LogicEditor :field="props.field" ref="editor"/>
      <template #footer>
        <el-button type="primary" @click="close" text>关闭</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { FormDesignerContext, FormField, useRenderContext } from '@dongls/xform'
import { ref, computed } from 'vue'
import { LogicEditor, LogicEditorApi } from '@common/components/FieldLogic'

const rc = useRenderContext<FormDesignerContext>()
const editor = ref<LogicEditorApi>(null)
const props = defineProps({
  field: {
    type: FormField,
    required: true
  }
})

const visible = ref(false)
const logic = computed({
  get(){
    return props.field.logic
  },
  set(v){
    rc.updateField(props.field, { prop: 'logic', value: v })
  }
})

function showModal(){
  visible.value = true
}

function save(){
  const api = editor.value
  if(api == null) return

  const r = api.submit()
  if(!r.valid) return

  logic.value = r.data
  visible.value = false
}

function close(){
  visible.value = false
}
</script>

<style lang="scss" module="classes">
.modal :global{
  .el-dialog__header{
    border-bottom: 1px solid #dee2e6;
    margin-right: 0;
    padding: 10px 0 10px 10px;
  }

  .el-dialog__body{
    padding: 0;
  }

  .el-dialog__headerbtn{
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    
    i {
      vertical-align: middle;
    }
  }

  .el-dialog__footer{
    padding: 10px;
    border-top: 1px solid #dee2e6;
  }
}

.logicBtn{
  float: right;
}

.tip{
  color: var(--xform-text-color-secondary);
}
</style>