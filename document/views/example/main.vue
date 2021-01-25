<template>
  <div v-if="state.loading" class="loading">Loading...</div>
  <div v-else class="example">
    <div class="header">
      <div class="header-left">
        <div class="logo">xForm<small>v{{ version }}</small></div>
      </div>
      
      <nav class="nav">
        <router-link to="/example/designer" class="nav-link"><strong>1. </strong>设计表单</router-link>
        <router-link to="/example/builder" class="nav-link"><strong>2. </strong>填写表单</router-link>
        <router-link to="/example/viewer" class="nav-link"><strong>3. </strong>查看表单</router-link>
      </nav>

      <div class="header-right">
        <router-link v-show="false" to="/doc">文档</router-link>
        <div class="libs">
          <label>UI库：</label>
          <div class="lib-picker">
            <select :value="state.preset" @input="handlePreset">
              <option value="bootstrap">Bootstrap</option>
              <!-- <option value="antdv">Ant Design Vue</option> -->
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="main xform-is-scroll">
      <router-view :key="state.key" @view="viewJson"/>
    </div>

    <modal v-model:show="state.show" :title="state.title">
      <textarea class="form-control example-value" :value="state.json" readonly/>
    </modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { usePreset } from './preset'
import { version } from '@core/index'

export default defineComponent({
  name: 'example',
  setup(){
    const state = reactive({
      loading: true,
      key: 0,
      preset: '',

      show: false,
      json: '',
      title: ''
    })

    usePreset('bootstrap', state)

    return {
      state,
      version,
      viewJson(event: any){
        const { title, json } = event

        state.title = title
        state.json = json
        state.show = true
      },
      handlePreset(event: Event){
        const target = event.target as HTMLSelectElement
        const option = target.options[target.selectedIndex]
        const value = option.value

        usePreset(value, state)
      }
    }
  }
})
</script>

<style lang="scss">
$--xform-color-primary: rgb(0,123,255) !default;
$nav-link-darken: darken($--xform-color-primary, 12%); 

textarea.example-value{
  height: calc(100vh - 150px);
  resize: none;
  font-size: 14px;
  font-family: 'cascadia code', Consolas, Arial, Helvetica, sans-serif;
  box-sizing: border-box;
}

.icon-outbound{
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;

  background: url('../../assets/svg/outbound.svg') no-repeat;
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

.nav{
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
    text-decoration: none;
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

.nav-link{
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

  & + .nav-link{
    margin-left: 4px;
  }
}

.btn-text{
  text-decoration: none !important;
}

.loading{
  padding-top: 24vh;
  text-align: center;
  font-size: 16px;
}
</style>