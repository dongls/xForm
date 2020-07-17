<template>
  <header class="doc-header">
    <div class="doc-header-main">
      <div class="doc-logo">
        <strong>xForm</strong>
        <small v-if="version">v{{ version }}</small>
      </div>
      <div class="doc-header-links">
        <a :href="`${config.base}example.html`" target="_blank">示例</a>
        <a href="https://github.com/dongls/xForm" target="_blank">GitHub</a>
      </div>
    </div>
  </header>
  <div class="doc-container">
    <nav class="doc-nav">
      <ul class="doc-menus">
        <li v-for="menu in menus" :key="menu.path" :class="{ 'doc-menu-loading': menu.status == 1 }">
          <h3 v-if="menu.group" class="doc-menu-title">{{ menu.name }}</h3>
          <router-link v-else :to="menu.path">{{ menu.name }}</router-link>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    return { menus }
  }
})
</script>