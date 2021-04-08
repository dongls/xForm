<template>
  <div :class="`xform-bs-field-setting xform-bs-${fieldRef.type}-setting`">
    <h3 class="xform-bs-field-setting-head">{{ field.conf.title }}</h3>

    <section class="xform-bs-field-setting-prop">
      <header>标题：</header>
      <input type="text" class="form-control form-control-sm" placeholder="请输入标题..." v-model="fieldRef.title">
    </section>

    <section class="xform-bs-field-setting-prop" v-if="placeholder">
      <header>提示：</header>
      <textarea class="form-control form-control-sm" placeholder="请输入提示信息..." rows="3" v-model="fieldRef.placeholder"/>
    </section>

    <section class="xform-bs-field-setting-prop" v-if="attributes">
      <header>属性：</header>
      <div v-if="required" class="custom-control custom-checkbox custom-control-inline" title="勾选则该字段在表单提交时必须填写">
        <input :id="`${field.name}-required`" :name="`${field.name}-required`" type="checkbox" class="custom-control-input" v-model="fieldRef.required">
        <label class="custom-control-label" :for="`${field.name}-required`">必填</label>
      </div>
      <div class="custom-control custom-checkbox custom-control-inline" title="勾选则该字段在表单中无法编辑, 也不参与表单验证">
        <input :id="`${field.name}-disabled`" :name="`${field.name}-disabled`" type="checkbox" class="custom-control-input" v-model="fieldRef.disabled">
        <label class="custom-control-label" :for="`${field.name}-disabled`">禁用</label>
      </div>
      <div class="custom-control custom-checkbox custom-control-inline" title="勾选则该字段将不会再表单中显示">
        <input :id="`${field.name}-hidden`" name="`${field.name}-hidden`" type="checkbox" class="custom-control-input" v-model="fieldRef.hidden">
        <label class="custom-control-label" :for="`${field.name}-hidden`">隐藏</label>
      </div>
      <slot name="attributes"/>
    </section>

    <slot/>

    <section v-if="logic" class="xform-bs-field-setting-prop">
      <header>
        <span>逻辑：</span>
        <button type="button" class="btn btn-link is-logic-btn" @click="showLogicModal = true">配置</button>
      </header>
      <div>logic</div>
      <modal title="配置字段逻辑" v-model:visible="showLogicModal" @confirm="saveLogic">
        logic
      </modal>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue'
import { XField } from '@dongls/xform'
import Modal from './Modal.vue'

export default defineComponent({
  name: 'field-setting',
  props: {
    field: {
      type: XField,
      required: true
    },
    placeholder: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    },
    logic: {
      type: Boolean,
      default: false
    },
    attributes: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const showLogicModal = ref(false)
    const fieldRef = toRef(props, 'field')

    function saveLogic(){
      showLogicModal.value = false
    }

    return {
      showLogicModal,
      saveLogic,
      fieldRef
    }
  },
  components: {
    [Modal.name]: Modal
  }
})
</script>

<style lang="scss">
.xform-bs-field-setting-head{
  margin: 0;
  line-height: 24px;
  font-size: 16px;
  border-bottom: 1px solid rgba(0,0,0,.125);
  font-weight: 700;
  padding: 0 0 3px 0;
  margin-bottom: 10px;
}

.xform-bs-field-setting-prop{
  margin-bottom: 15px;
}

.xform-bs-field-setting-prop > header{
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 5px;
}

.is-logic-btn{
  padding: 0;
  box-shadow: none !important;
  font-size: 14px;
  line-height: 20px;
  border: none;
  float: right;
}
</style>