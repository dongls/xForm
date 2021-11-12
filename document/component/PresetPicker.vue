<template>
  <div :class="classes.picker">
    <a href="https://github.com/vuejs/vue-next" target="_blank" class="example-with-slash">Vue@{{ VUE_VERSION }}</a>
    <div :class="classes.preset">
      <a :href="preset.homepage" target="_blank">{{ preset.name }}@{{ preset.version }}</a>
      <ul :class="classes.panel">
        <template v-for="option in preset.infos" :key="option.id">
          <li 
            v-if="option.show" 
            :class="{'is-dev': option.IS_DEV}"
            @click="choose(option)"
          >
            <strong>{{ option.name }}</strong>
            <small>{{ option.version }}</small>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { savePresetNameToLocal } from '@document/views/example/preset'
import { VUE_VERSION } from '@document/util/common'

export default defineComponent({
  name: 'preset-picker',
  props: {
    preset: {
      type: Object,
      default: () => ({})
    },
  },
  setup() {
    return {
      VUE_VERSION,
      choose(preset: any){
        savePresetNameToLocal(preset.id)
        window.location.reload()
      }
    }
  },
})
</script>

<style lang="scss" module="classes">
.picker{
  display: inline-block;
}

.preset{
  position: relative;
  display: inline-block;


  &:hover .panel{
    display: block;
  }
}

.panel{
  display: none;
  position: absolute;
  left: 0;
  top: 100%;
  background-color: #fff;
  z-index: 9;
  color: var(--doc-text-color-primary);
  list-style: none;
  margin: 0;
  padding: 0;
  width: 180px;
  box-shadow: 0 1px 8px rgba(0, 123, 255, .15);

  li{
    padding: 4px 5px;
    line-height: 24px;
    font-size: 14px;
    text-align: left;
    transition: background-color ease .3s;
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    color: #000;

    strong{
      font-size: 14px;
      font-weight: 400;
    }

    small{
      color: #989dab;
    }

    &:global(.is-dev) strong{
      color: red !important;
    }

    &:hover{
      color: var(--doc-link-color);
      background-color: var(--doc-link-hover-bg-color);
    }

    & + li{
      border-top: 1px dashed #ccc;
    }
  }
}
</style>