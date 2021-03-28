<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'

export default defineComponent({
  name: 'modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:show'],
  setup(props, { emit }){
    function close(){
      props.show && emit('update:show', false)
    }

    function onEsc(event: KeyboardEvent){
      const key = event.key.toLowerCase()
      if(key == 'escape' && props.show) close()
    }

    onMounted(() => document.addEventListener('keydown', onEsc))
    onBeforeUnmount(() => document.removeEventListener('keydown', onEsc))

    return { close }
  }
})
</script>

<template>
  <transition name="exa-fade">
    <div v-if="show" class="exa-modal-mask">
      <div class="exa-modal">
        <div class="exa-modal-header">
          <h3 v-if="title">{{ title }}</h3>
          <button type="button" class="exa-modal-close" @click="close">&times;</button>
        </div>
        <div class="exa-modal-body"><slot/></div>
      </div>
    </div>
  </transition>
</template>

<style>
.exa-modal-mask{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(255, 255, 255, .25);
}

.exa-modal{
  width: 80vw;
  max-width: 1200px;
  margin: 50px auto;
  border-radius: 1px;
  box-shadow: 1px 6px 20px 5px rgba(40, 120, 255, 0.125), 1px 16px 24px 2px rgba(0, 0, 0, 0.075);
  background-color: #fff;
}

.exa-modal-header{
  display: flex;
  flex-flow: row nowrap;

  border-bottom: 1px solid #ddd;
}

.exa-modal-header > h3{
  flex: 1;
  margin: 0;
  padding: 8px 10px;
  line-height: 20px;
  font-size: 16px;
  font-weight: 700;
}

.exa-modal-close{
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 24px;
  color: #666;
  transition: color ease .3s;
  outline: none !important;
}

.exa-modal-close:hover{
  color: red;
}

.exa-modal-body{
  padding: 10px;
}

/** transition */
.exa-fade-enter-active, 
.exa-fade-leave-active{
  transition: opacity ease-in-out .15s;
}
.exa-fade-enter-from, 
.exa-fade-leave-to {
  opacity: 0;
}

.exa-fade-enter-active .exa-modal, 
.exa-fade-leave-active .exa-modal{
  transition: transform ease-in-out .15s;
}
.exa-fade-enter-from .exa-modal, 
.exa-fade-leave-to .exa-modal {
  transform: scale(.85);
}
</style>