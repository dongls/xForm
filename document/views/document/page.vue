<template>
  <article :key="path" :path="path" class="article" @click="proxy" v-html="content" />
  <div class="doc-affix">
    <ul class="article-toc"/>
  </div>
  <footer-guide/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, Ref, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate, RouteLocationNormalized, NavigationGuardNext, useRouter, Router } from 'vue-router'
import { load, getMenu, MenuStatusEnum } from './menus'
import FooterGuide from '@document/component/FooterGuide.vue'
import enhance from '@document/util/enhance'

async function loadDocument(route: RouteLocationNormalized, content: Ref<string>, router: Router, next?: NavigationGuardNext){
  const menu = getMenu(route.path)
  if(null == menu) {
    const to = '/not-found'
    return typeof next == 'function' ? next(to) : router.replace(to)
  }

  if(menu.status == MenuStatusEnum.INIT) menu.status = MenuStatusEnum.LOADING
  content.value = await load(route.path)
  if(menu.status == MenuStatusEnum.LOADING) menu.status = MenuStatusEnum.LOADED
  document.title = menu.name

  if(typeof next == 'function') next()
  enhance(route.path, route.hash)
}

function proxy(router: Router, event: Event){
  const target = event.target as HTMLElement
  if(target.classList.contains('article-anchor')) return

  const tag = target.tagName.toLowerCase()
  if(tag == 'a'){
    event.preventDefault()
    const a = target as HTMLAnchorElement
    const href = a.getAttribute('href')

    if(href.startsWith('/doc/')) return router.push(href)

    return window.open(a.href)
  }
}

export default defineComponent({
  name: 'doc',
  setup(){
    const content = ref('')

    const route = useRoute()
    const router = useRouter()

    onBeforeMount(() => {
      loadDocument(route, content, router)
    })

    onBeforeRouteUpdate((to, from, next) => {
      // 只是hash变化不加载文档
      if(to.fullPath.split('#')[0] == from.fullPath.split('#')[0]) return

      loadDocument(to, content, router, next)
    })

    return { 
      content,
      path: computed(() => route.path),
      proxy: proxy.bind(null, router)
    }
  },
  components: {
    [FooterGuide.name]: FooterGuide
  }
})
</script>