<template>
  <section class="xform-bs-field-setting-prop">
    <header>
      <span>逻辑：</span>
      <button type="button" class="btn btn-link btn-text" :class="classes.logicBtn" @click="showModal">配置</button>
    </header>

    <div :class="classes.tip">配置字段逻辑后，如果依赖的字段能够满足指定的条件，就会显示该字段，否则会隐藏该字段。</div>

    <Modal 
      title="配置逻辑" 
      :class="classes.modal" width="840px"
      v-model:visible="visible" @confirm="save"
    >
      <LogicEditor :field="field" ref="editor"/>
    </Modal>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { FormDesignerContext, FormField, useRenderContext } from '@dongls/xform'
import { LogicEditor, LogicEditorApi } from '@common/components/FieldLogic/index'

import Modal from './Modal.vue'

export default defineComponent({
  name: 'field-logic',
  props: {
    field: {
      type: FormField,
      required: true
    },
  },
  setup(props) {
    const rc = useRenderContext<FormDesignerContext>()
    const editor = ref<LogicEditorApi>(null)

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
    
    return {
      editor,
      logic,
      visible,
      save,
      showModal,
    }
  },
  components: {
    LogicEditor,
    Modal
  }
})
</script>

<style lang="scss" module="classes">
.modal{
  :global(.modal-body){
    overflow: auto;
    padding: 0;
  }
}

.logicBtn{
  padding: 0;
  box-shadow: none !important;
  font-size: 14px;
  line-height: 20px;
  border: none;
  float: right;
}

.tip{
  color: var(--xform-text-color-secondary);
}
</style>