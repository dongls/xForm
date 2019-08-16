<template>
  <div class="modal-mask" v-if="show">
    <div class="modal">
      <div class="modal-header">
        <h3 v-if="title">{{ title }}</h3>
        <button type="button" class="modal-close" @click="close">x</button>
      </div>
      <div class="modal-body">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  methods: {
    close(){
      this.$emit('update:show', false)
    }
  }
}
</script>

<style>
.modal-mask{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, .15);
}

.modal{
  width: 720px;
  margin: 50px auto;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  background-color: #fff;
}

.modal-header{
  display: flex;
  flex-flow: row nowrap;

  border-bottom: 1px solid #ddd;
}

.modal-header > h3{
  flex: 1;
  margin: 0;
  padding: 8px 10px;
  line-height: 20px;
  font-size: 16px;
  font-weight: 400;
}

.modal-close{
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 18px;
}

.modal-close:hover{
  color: red;
}

.modal-body{
  padding: 10px;
}
</style>