<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'xform-divider',
  props: {
    title: {
      type: String,
      default: null
    },
    layout: {
      type: String,
      default: 'center'
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
      const style: any = {}

      if(this.top > 0) style.marginTop = `${this.top}px`
      if(this.bottom > 0) style.marginBottom = `${this.bottom}px`

      return style
    }
  }
})

</script>

<template>
  <div :class="['xform-divider', `xform-divider-${layout}`]" :style="style">
    <div :class="['xform-divider-line', `xform-divider-type-${type}`]"/>
    <strong v-if="title" class="xform-divider-title">{{ title }}</strong>
  </div>
</template>

<style lang="scss">
$xform-divider-border-color: #666;

.xform-divider{
  position: relative;
  height: 32px;
  line-height: 32px;
  padding: 0 5px;
  text-align: center;

  &.xform-item{
    display: block;
  }
}

.xform-divider.xform-divider-left{
  text-align: left;
}

.xform-divider.xform-divider-right{
  text-align: right;
}

.xform-divider-line{
  position: absolute;
  left: 0;
  right: 0;
  z-index: 0;
}

.xform-divider-line.xform-divider-type-solid{
  top: 15px;
  border-top: 1px solid $xform-divider-border-color;
}

.xform-divider-line.xform-divider-type-dashed{
  top: 15px;
  border-top: 1px dashed $xform-divider-border-color;
}

.xform-divider-line.xform-divider-type-double{
  box-sizing: border-box;
  top: 14px;
  height: 4px;
  border-top: 1px solid $xform-divider-border-color;
  border-bottom: 1px solid $xform-divider-border-color;
}

.xform-divider-line.xform-divider-type-solid-dashed{
 box-sizing: border-box;
  top: 14px;
  height: 4px;
  border-top: 1px solid $xform-divider-border-color;
  border-bottom: 1px dashed $xform-divider-border-color;
}

.xform-divider-line.xform-divider-type-dashed-solid{
 box-sizing: border-box;
  top: 14px;
  height: 4px;
  border-top: 1px dashed $xform-divider-border-color;
  border-bottom: 1px solid $xform-divider-border-color;
}

.xform-divider-title{
  position: relative;
  z-index: 1;
  padding: 0 5px;
  font-size: 18px;
  font-weight: 600;
  background-color: #fff;
}

.xform-el-divider-preview{
  padding: 8px;
}

.xform-el-divider-setting-types .el-radio-group{
  width: 100%;
}

.xform-el-divider-setting-type{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .el-radio{
    margin-right: 10px;
  }

  .el-radio__label{
    display: none;
  }

  .xform-divider{
    flex: 1;
  }
}

.xform-el-divider-margin{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  label{
    margin-right: 10px;
  }

  .el-slider{
    flex: 1;
  }
}
</style>
