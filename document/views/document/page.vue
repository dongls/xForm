<template>
  <article :key="path" :path="path" class="article" @click="proxy" v-html="content" />
  <div class="doc-affix">
    <ul class="article-toc" @click.prevent="scrollToSection"/>
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
  const value = await load(route.path)
  if(menu.status == MenuStatusEnum.LOADING) menu.status = MenuStatusEnum.LOADED
  content.value = value
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

function scrollToSection(event: MouseEvent){
  const target = event.target as HTMLElement
  if(target.tagName != 'A') return

  const hash = target.getAttribute('href').slice(1)
  const element = document.getElementById(hash)
  if(element == null) return

  const section = element.closest('section')
  const top = section.offsetTop

  document.documentElement.scrollTop = top
}

export default defineComponent({
  name: 'doc',
  emits: ['loaded'],
  setup(props, { emit }){
    const content = ref('')    
    const route = useRoute()
    const router = useRouter()

    onBeforeMount(async () => {
      await loadDocument(route, content, router)
      emit('loaded')
    })

    onBeforeRouteUpdate((to, from, next) => {
      // 只是hash变化不加载文档
      if(to.fullPath.split('#')[0] == from.fullPath.split('#')[0]) return

      loadDocument(to, content, router, next)
    })

    return { 
      content,
      scrollToSection,
      path: computed(() => route.path),
      proxy: proxy.bind(null, router)
    }
  },
  components: {
    [FooterGuide.name]: FooterGuide
  }
})
</script>