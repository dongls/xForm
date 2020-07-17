<script lang="ts">
import XForm from '@core/index'
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup(){
    const show = ref(false)
    const title = ref('')
    const json = ref('')
    const style = { 
      // visibility: 'hidden'
      visibility: 'visible' 
    }
    
    return {
      show,
      title,
      json,
      version: XForm.version,
      style,
      viewJson(event: any): void{
        const { title, json } = event

        this.title = title
        this.json = json
        this.show = true
      }
    }
  }
})
</script>

<template>
  <div class="example" :style="style">
    <div class="header">
      <div class="logo">xForm<small>v{{ version }}</small></div>
      <nav class="nav">
        <router-link to="/designer" class="nav-link"><strong>1. </strong>设计表单</router-link>
        <router-link to="/builder" class="nav-link"><strong>2. </strong>填写表单</router-link>
        <router-link to="/viewer" class="nav-link"><strong>3. </strong>查看表单</router-link>
      </nav>
      <select class="libs">
        <option>Bootstrap</option>
      </select>
    </div>
    <div class="main">
      <router-view @view="viewJson"/>
    </div>

    <modal v-model:show="show" :title="title">
      <textarea class="form-control example-value" :value="json" readonly/>
    </modal>
  </div>
</template>

<style lang="scss">
$--xform-color-primary: rgb(0,123,255) !default;
$nav-link-darken: darken($--xform-color-primary, 18%); 

body{
  font-size: 14px;
  padding: 0;
  margin: 0;
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Helvetica,Microsoft YaHei,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
}

textarea{
  display: block;
  width: 100%;
}

input, textarea{
  font-family: Arial, Helvetica, sans-serif;
}

textarea.example-value{
  height: calc(100vh - 150px);
  resize: none;
  font-size: 14px;
  font-family: 'cascadia code', Consolas, Arial, Helvetica, sans-serif;
  box-sizing: border-box;
}

.example{
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

.main{
  flex: 1;
  height: 0;
  overflow: auto;
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
}

.nav{
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  background-color: #fff;
}

.header .libs{
  position: absolute;
  height: 24px;
  right: 20px;
  border: none;
  outline: none;
  border-radius: 1px;
  background-color: transparent;
  color: #fff;
}

.nav-link{
  display: block;
  position: relative;
  width: 100px;
  line-height: 24px;
  padding: 10px 10px 10px 30px;
  color: #fff !important;
  text-align: center;
  text-decoration: none;
  transition: background-color ease .3s;
  background-color: $--xform-color-primary;
  box-sizing: content-box;

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

.header-right{
  position: relative;
  padding-right: 10px;
}

.logo{
  position: absolute;
  left: 20px;
  font-weight: 600; 
  font-size: 24px;
  color: #fff;

  small{
    font-weight: 400;
    font-size: 13px;
    margin-left: 4px;
  }
}

.btn-text{
  text-decoration: none !important;
}
</style>