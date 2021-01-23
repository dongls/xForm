<template>
  <header class="doc-header">
    <div class="doc-header-main">
      <div class="doc-logo">
        <strong>xForm</strong>
        <small v-if="version">v{{ version }}</small>
      </div>
      <div class="doc-header-links">
        <router-link to="/example">示例</router-link>
        <i class="icon-outbound"/>
        <a href="https://github.com/dongls/xForm" target="_blank">GitHub</a>
        <i class="icon-outbound"/>
      </div>
    </div>
  </header>
  <div class="doc-container">
    <nav class="doc-nav" :class="{'is-open': isOpen}" @click="closeNav">
      <ul class="doc-menus">
        <li v-for="(menu, index) in menus" :key="index" :class="genMenuClass(menu)">
          <span v-if="menu.group" >{{ menu.name }}</span>
          <template v-else>
            <router-link :to="menu.path">{{ menu.name }}</router-link>
            <small v-if="menu.subtitle">{{ menu.subtitle }}</small>
          </template>
        </li>
      </ul>
    </nav>
    <div class="doc-content">
      <main class="doc-main"><router-view/></main>
    </div>
  </div>
  <footer class="doc-footer">
    <p class="doc-copyright">Copyright © 2019-present dongls</p>
  </footer>
  <button type="button" class="doc-toggle-btn" @click="showNav">目录</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { menus } from './menus'

// eslint-disable-next-line no-undef
const VERSION = __VERSION__

export default defineComponent({
  name: 'document',
  setup(){
    const isOpen = ref(false)
    return { 
      menus,
      isOpen,
      showNav(){
        isOpen.value = true
      },
      closeNav(){
        if(isOpen.value) isOpen.value = false
      },
      genMenuClass(menu: any){
        return {
          'doc-menu-group': menu.group, 
          'doc-menu-item': !menu.group,
          'doc-menu-loading': menu.status == 1
        }
      },
      version: VERSION
    }
  }
})
</script>

<style>

</style>