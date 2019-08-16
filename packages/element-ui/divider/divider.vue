<template>
  <div :class="['xform-divider', `xform-divider-${this.layout}`]" :style="style">
    <div :class="['xform-divider-line', `xform-divider-type-${this.type}`]"/>
    <strong class="xform-divider-title" v-if="title">{{ title }}</strong>
  </div>
</template>

<script>
export default {
  name: 'xform-divider',
  props: {
    title: {
      type: String,
      default: null
    },
    layout: {
      type: String,
      default: 'left'
    },
    type: {
      type: String,
      default: 'solid'
    },
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    }
  },
  computed: {
    style(){
      const style = {};

      if(this.top > 0) style.marginTop = `${this.top}px`;
      if(this.bottom > 0) style.marginBottom = `${this.bottom}px`;

      return style;
    }
  }
}
</script>