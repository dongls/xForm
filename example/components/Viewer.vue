<template>
  <div class="viewer">
    <xform-viewer :fields="fields" :value="model">
      <!-- slot -->
    </xform-viewer>
  </div>
</template>

<script>
import localData from '../mixin/localData';

export default {
  name: 'viewer',
  inject: ['fieldKey', 'modelKey'],
  mixins: [localData],
  data(){
    return {
      fields: this.getLocalFields(),
      model: this.getLocalModel()
    }
  },
  methods: {
    getLocalModel(){
      const key = this.modelKey;
      const str = localStorage.getItem(key);
      
      try {
        return JSON.parse(str) || {}
      } catch (error) {
        return []
      }
    }
  },
  activated(){
    this.fields = this.getLocalFields()
    this.model = this.getLocalModel()
  }
}
</script>

<style>
.viewer .xform-viewer{
  padding: 10px 0;
}
</style>