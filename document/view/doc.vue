<template>
  <article :key="path" :path="path" class="article" @click="proxy" v-html="content" />
  <div class="doc-affix">
    <ul class="article-toc" @click.prevent="jump"/>
  </div>
  <footer-guide/>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, Ref, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate, RouteLocationNormalized, NavigationGuardNext, useRouter, Router } from 'vue-router'
import { load, getMenu, MenuStatusEnum } from '../menus'
import FooterGuide from '../component/FooterGuide.vue'
import enhance, { scrollTo } from './enhance'

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
  await enhance(route.path)

  if(null != route.hash) scrollTo(route.hash)
}

function proxy(router: Router, event: Event){
  const target = event.target as HTMLElement
  const tag = target.tagName.toLowerCase()
  
  if(tag == 'a'){
    event.preventDefault()
    const a = target as HTMLAnchorElement
    const href = a.getAttribute('href')

    if(a.classList.contains('article-anchor')) return scrollTo(href)
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
      loadDocument(to, content, router, next)
    })

    return { 
      content,
      path: computed(() => route.path),
      proxy: proxy.bind(null, router),
      jump(event: Event){
        const target = event.target as HTMLElement
        if(target.tagName.toLowerCase() != 'a') return

        scrollTo(target.getAttribute('href'))
      }
    }
  },
  components: {
    [FooterGuide.name]: FooterGuide
  }
})
</script>