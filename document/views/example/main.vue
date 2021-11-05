<template>
  <div v-if="!loading" class="example">
    <div class="header">
      <div class="header-left">
        <div class="logo">xForm<small>v{{ version }}</small></div>
      </div>
      
      <nav class="example-nav">
        <router-link to="/example/designer" class="example-nav-link"><strong>1. </strong>设计表单</router-link>
        <router-link to="/example/builder" class="example-nav-link"><strong>2. </strong>填写表单</router-link>
        <router-link to="/example/viewer" class="example-nav-link"><strong>3. </strong>查看表单</router-link>
      </nav>

      <div class="header-right">
        <router-link v-if="isDev" to="/doc">文档</router-link>
        <div class="libs" :title="`${preset}@${presetVersion}`">
          <label>UI库：</label>
          <div class="lib-picker">
            <select :value="preset" @input="handlePreset">
              <option value="bootstrap">Bootstrap</option>
              <option value="element-plus">Element Plus</option>
              <option value="antdv" v-if="isDev">Ant Design Vue</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="main xform-is-scroll" :class="{'is-wide': isWide}">
      <router-view @view="viewJson"/>
    </div>

    <modal v-model:show="show" :title="title">
      <textarea class="example-value" :value="json" readonly/>
    </modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { version } from '@dongls/xform'
import { savePresetNameToLocal, usePreset } from './preset'
import { useIsWide, IS_DEV } from '../../util/common'

function toggleClass(){
  document.documentElement.classList.add('is-example')

  onBeforeUnmount(() => {
    document.documentElement.classList.remove('is-example')
  })
}

export default defineComponent({
  name: 'example',
  setup(){
    const loading = ref(false)
    const show = ref(false)
    const json = ref<string>()
    const title = ref<string>()
    const preset = usePreset(loading)

    preset.use()
    toggleClass()

    return {
      isDev: IS_DEV,
      isWide: useIsWide(),
      json,
      loading,
      preset: preset.name,
      presetVersion: preset.version,
      show,
      title,
      version: version,
      viewJson(event: any){
        title.value = event.title
        json.value = event.json
        show.value = true
      },
      handlePreset(event: Event){
        const target = event.target as HTMLSelectElement
        const option = target.options[target.selectedIndex]
        const value = option.value

        savePresetNameToLocal(value)
        window.location.reload()
      }
    }
  }
})
</script>

<style lang="scss">
$--xform-color-primary: rgb(0,123,255) !default;
$nav-link-darken: darken($--xform-color-primary, 12%); 

textarea.example-value{
  display: block;
  height: calc(100vh - 150px);
  width: 100%;
  resize: none;
  font-size: 14px;
  font-family: 'cascadia code', Consolas, Arial, Helvetica, sans-serif;
  box-sizing: border-box;
  line-height: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  outline: none;

  &:focus{
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 .2rem rgba(0,123,255,.25)
  }
}

.icon-outbound{
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;

  background: url('../../assets/svg/outbound.svg') no-repeat;
}

html.is-example{
  overflow: hidden;
}

.example{
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

.main{
  flex: 1;
  height: 0;
}

.header{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  position: relative;
  z-index: 99;

  background-color: $--xform-color-primary;
  box-shadow: 0 1px 8px rgba($--xform-color-primary, .5);
  user-select: none;
  font-size: 15px;
}

.example-nav{
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  background-color: #fff;
}

.example .libs{
  font-size: 15px;
  color: #fff;
  margin-left: 20px;
  display: flex;
  flex-flow: row nowrap;

  label{
    margin: 0;
  }

  select{
    border: none;
    outline: none;
    background-color: transparent;
    color: #fff;
    width: 120px;
    appearance: none;
    font-weight: 700;
    padding-right: 12px;
    font-size: 14px;

    option{
      color: var(--doc-text-color-primary);
    }
  }
}

.lib-picker{
  position: relative;

  &::after{
    content: "";
    position: absolute;
    right: 0;
    top: 9px;
    border-top: 5px solid;
    border-right: 5px solid transparent;
    border-bottom: 0;
    border-left: 5px solid transparent;
  }
}

.header-left{
  position: absolute;
  left: 0;
  padding-left: 10px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.header-right{
  position: absolute;
  right: 0;
  padding-right: 10px;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  a {
    color: #fff !important;
  }
}

.logo{
  font-weight: 600; 
  font-size: 24px;
  color: #fff;

  small{
    font-weight: 400;
    font-size: 13px;
    margin-left: 4px;
  }
}

.example-nav-link{
  display: block;
  position: relative;
  width: 100px;
  line-height: 24px;
  height: 24px;
  padding: 10px 10px 10px 30px;
  color: #fff !important;
  text-align: center;
  text-decoration: none;
  transition: background-color ease .3s;
  background-color: $--xform-color-primary;
  box-sizing: content-box;
  border: none;
  text-decoration: none !important;

  &:after,
  &:before{
    content: "";
    position: absolute;
    top: 0;
    height: 0;
    width: 0;
    border-top: 22px solid transparent;
    border-bottom: 22px solid transparent;
    transition: border-color ease .3s;
  }

  &:before{
    left: 0;
    border-left: 20px solid #fff;
    z-index: 8;
  }

  &:after{
    right: -20px;
    border-left: 20px solid $--xform-color-primary;
    z-index: 9;
  }

  &:hover,
  &.router-link-active{
    background-color: $nav-link-darken;

     &:after{
      border-left-color: $nav-link-darken;
    }
  }

  &:nth-child(1){
    padding-left: 10px;

    &:before{
      content: none;
    }
  }

  &:nth-last-child(1):after{
    content: none;
  }

  & + .example-nav-link{
    margin-left: 4px;
  }
}

.btn-text{
  text-decoration: none !important;
}
</style>