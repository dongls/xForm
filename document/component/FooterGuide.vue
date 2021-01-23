<template>
  <div v-if="relation.prev || relation.next" class="doc-footer-guide">
    <div v-if="relation.prev" class="doc-footer-guide-prev">
      <span>← </span>
      <router-link :to="relation.prev.path">{{ relation.prev.name }}</router-link>
    </div>

    <div v-if="relation.next" class="doc-footer-guide-next">
      <router-link :to="relation.next.path">{{ relation.next.name }}</router-link>
      <span> →</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getMenuRelation } from '@document/views/document/menus'

export default defineComponent({
  name: 'footer-guide',
  setup(){
    const route = useRoute()
    const relation = computed(() => getMenuRelation(route.path) || {})

    return {
      relation
    }
  }
})
</script>