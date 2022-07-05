<template>
  <div v-if="!loading" class="example">
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <strong>xForm</strong>
          <span class="example-with-slash">v{{ version }}-{{ TIMESTAMP }}</span>
          <preset-picker :preset="preset"/>
        </div>
      </div>
      
      <nav class="example-nav">
        <router-link to="/example/designer" class="example-nav-link"><strong>1. </strong>设计表单</router-link>
        <router-link to="/example/builder" class="example-nav-link"><strong>2. </strong>填写表单</router-link>
        <router-link to="/example/viewer" class="example-nav-link"><strong>3. </strong>查看表单</router-link>
      </nav>

      <div class="header-right">
        <router-link v-if="IS_DEV" to="/doc">文档</router-link>
        <a href="https://github.com/dongls/xForm" target="_blank" class="example-icon-github">
          <img src="../../assets/svg/github.svg">
          <span>GitHub</span>
        </a>
      </div>
    </header>

    <main class="main xform-is-scroll" :class="{'is-wide': isWide}">
      <router-view @view="viewJson"/>
    </main>

    <modal v-model:show="modalState.show" :title="modalState.title">
      <textarea class="example-value" :value="modalState.json" readonly/>
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { version } from '@dongls/xform'
import { usePreset } from './preset'
import { useIsWide, IS_DEV, TIMESTAMP } from '../../util/common'

const loading = ref(false)
const preset = usePreset(loading)
const isWide = useIsWide()

const modalState = reactive({
  show: false,
  json: '',
  title: null
})

function useToggleClass(){
  document.documentElement.classList.add('is-example')

  onBeforeUnmount(() => {
    document.documentElement.classList.remove('is-example')
  })
}

function viewJson(event: any){
  modalState.title = event.title
  modalState.json = event.json
  modalState.show = true
}

preset.install()
useToggleClass()
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

  a:not(.example-nav-link) {
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-bottom-color ease .3s;
  }

  a:not(.example-nav-link):hover {
    text-decoration: none;
    border-bottom-color: #fff;
  }
}

.example-nav{
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  background-color: #fff;
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
  color: #fff;

  strong{
    font-weight: 600; 
    font-size: 24px;
  }

  span{
    font-weight: 400;
    font-size: 13px;
    margin-left: 4px;
    white-space: pre;
  }

  a{
    font-size: 13px;
  }
}

.example-with-slash{
  display: inline-block;
  position: relative;
  line-height: 20px;
  margin-right: 15px;

  &::after{
    content: '/';
    position: absolute;
    right: -15px;
    top: 0;
    line-height: 20px;
    width: 15px;
    text-align: center;
  }
}

.example-icon-github{
  margin-left: 40px;
  position: relative;

  img{
    position: absolute;
    top: 4px;
    left: -20px;
    width: 16px;
    height: 16px;
    z-index: 0;
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
</style>