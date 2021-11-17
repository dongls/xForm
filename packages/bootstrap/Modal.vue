<template>
  <teleport to="body">
    <div 
      class="modal fade xform-bs-modal" :id="id" 
      v-if="rendered"
      v-bind="$attrs"
    >
      <div class="modal-dialog modal-dialog-centered" :style="{'width': width}" >
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header">
              <h5 class="modal-title" v-if="title">{{ title }}</h5>
            </slot>
            <button type="button" class="btn-close shadow-none" @click="close"/>
          </div>
          <div class="modal-body"><slot/></div>
          <div class="modal-footer">
            <div class="modal-footer-left" v-if="$slots['footer-left']">
              <slot name="footer-left"/>
            </div>
            <button type="button" class="btn btn-sm btn-link btn-text" @click="close">关闭</button>
            <button type="button" class="btn btn-sm btn-primary" @click="confirm">保存</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'

let seed = 10000
function useModal(){
  let modal: any = null
  let id = `xbs-modal__${seed++}`

  function createModal(){
    const el = document.getElementById(id)
    if(el == null) return null

    return new (window as any).bootstrap.Modal(el, {
      backdrop: 'static',
      keyboard: false
    })
  }

  function show(){
    modal = createModal()
    modal && modal.show()
  }

  function hide(callback?: Function){
    if(modal == null) return

    const element = modal._element as HTMLElement    
    const handle = function(){
      element.removeEventListener('hidden.bs.modal', handle)
      typeof callback == 'function' && callback()
    }

    element.addEventListener('hidden.bs.modal', handle)
    modal.hide()
  }
  
  function destroy(){
    const callback = function(){
      modal.dispose()
      modal = null
    }

    if(modal == null) return
    if(modal._isShown) return hide(callback)

    callback()
  }

  return {
    id,
    show,
    hide,
    destroy
  }
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
    const rendered = ref(false)
    const modal = useModal()

    function showModal(){
      rendered.value = true
      nextTick(() => modal.show())
    }

    function close(){
      emit('update:visible', false)
    }

    function closeModal(){
      modal.hide(() => {
        rendered.value = false
        emit('closed')
      })
    }

    function confirm(){
      emit('confirm')
    }

    function toggle(){
      props.visible ? showModal() : closeModal()
    }

    watch(() => props.visible, toggle)
    onBeforeUnmount(() => {
      modal.destroy()
      close()
    })

    return { id: modal.id, close, confirm, rendered }
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
    padding: 10px 18px 10px 10px;
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