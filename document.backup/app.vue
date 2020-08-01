<template>
  <header class="doc-header">
    <div class="doc-header-main">
      <div class="doc-logo">
        <strong>xForm</strong>
        <small v-if="version">v{{ version }}</small>
      </div>
      <div class="doc-header-links">
        <a :href="`${config.base}example.html`" target="_blank">在线示例</a>
        <i class="icon-outbound"/>
        <a href="https://github.com/dongls/xForm" target="_blank">GitHub</a>
        <i class="icon-outbound"/>
      </div>
    </div>
  </header>
  <div class="doc-container">
    <nav class="doc-nav" :class="{'is-open': isOpen}" @click="closeNav">
      <ul class="doc-menus">
        <template v-for="(menu, index) in menus" >
          <li v-if="menu.group" :key="index" class="doc-menu-group">{{ menu.name }}</li>
          <li v-else :key="index" class="doc-menu-item" :class="{ 'doc-menu-loading': menu.status == 1 }">
            <router-link :to="menu.path">{{ menu.name }}</router-link>
            <small v-if="menu.subtitle">{{ menu.subtitle }}</small>
          </li>
        </template>
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

export default defineComponent({
  name: 'app',
  props: {
    version: {
      type: String,
      default: null
    },
    config: {
      type: Object,
      default: null
    }
  },
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
      }
    }
  }
})
</script>