<template>
  <teleport to="body">
    <div 
      v-if="rendered" :id="id"
      class="modal fade xform-bs-modal" v-bind="$attrs"
      data-backdrop="static" data-keyboard="false" 
    >
      <div class="modal-dialog modal-dialog-centered" :style="{'width': width}" >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-if="title">{{ title }}</h5>
            <button type="button" class="close" @click="close"><span>&times;</span></button>
          </div>
          <div class="modal-body"><slot/></div>
          <div class="modal-footer">
            <div class="modal-footer-left" v-if="$slots['footer-left']">
              <slot name="footer-left"/>
            </div>
            <button type="button" class="btn btn-sm btn-link" @click="close">关闭</button>
            <button type="button" class="btn btn-sm btn-primary" @click="confirm">保存</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { genRandomStr } from '@dongls/xform'
import { defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'

function getJQuery(){
  return (window as any).jQuery
}

export default defineComponent({
  name: 'modal',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '640px'
    }
  },
  emits: ['update:visible', 'confirm', 'closed'],
  setup(props, { emit }) {
    const id = `xform-bs-modal-${genRandomStr()}`
    const rendered = ref(false)

    function showModal(){
      rendered.value = true
      nextTick(() => {
        const $ = getJQuery()
        $('#' + id).modal('show')
      })
    }

    function close(){
      emit('update:visible', false)
    }

    function closeModal(callback?: Function){
      const $ = getJQuery()
      $('#' + id).modal('hide').one('hidden.bs.modal', function(){
        rendered.value = false
        typeof callback == 'function' && callback()
        emit('closed')
      })
    }

    function confirm(){
      emit('confirm')
    }
    
    watch(() => props.visible, () => {
      props.visible ? showModal() : closeModal()
    }) 

    onBeforeUnmount(() => {
      const $ = getJQuery()
      $('#' + id).removeClass('fade').modal('hide').modal('dispose')
      rendered.value = false
    })

    return { id, close, confirm, rendered }
  }
})
</script>

<style lang="scss">
.xform-bs-modal{
  .modal-dialog {
    max-width: none;
  }

  .modal-title{
    margin: 0;
    padding: 0;
    line-height: 27px;
  }

  .modal-header{
    padding: 10px;
    align-items: center;
  }

  .modal-body{
    padding: 10px;
  }

  .modal-footer{
    position: relative;
    padding: 10px;

    .btn{
      margin: 0 0 0 10px;
      min-width: 60px;
    }
  }

  .modal-footer-left{
    margin: 0;
    position: absolute;
    left: 0;
    top: 10px;
  }
}
</style>