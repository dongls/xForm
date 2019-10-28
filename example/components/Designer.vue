<template>
  <div class="designer">
    <xform-designer :value="fields" @input="update" ref="designer" mode="example">
      <template #tool>
        <div class="designer-tool">
          <el-button type="text" icon="el-icon-delete" size="medium" @click="clear">清空</el-button>
          <el-button type="text" icon="el-icon-circle-check" size="medium" @click="submit">查看JSON</el-button>
        </div>
      </template>
    </xform-designer>
    <modal title="field json value" :show.sync="show">
      <textarea :value="json" class="example-value" rows="45" readonly/>
    </modal>
  </div>
</template>

<script>
import localData from '../mixin/localData';

export default {
  name: 'designer',
  inject: ['fieldKey'],
  mixins: [localData],
  data(){
    return {
      show: false,
      fields: this.getLocalFields()
    }
  },
  computed: {
    json(){
      return JSON.stringify(this.fields, null, '  ');
    }
  },
  methods: {
    update(value){
      this.fields = value;

      // 本地存储
      this.saveFieldsToLocal(this.fieldKey, value)
    },
    clear(){
      this.update([])
    },
    submit(){
      this.show = true;
    }
  }
}
</script>

<style lang="scss">
.designer-tool{
  text-align: right;
  border-bottom: 1px solid #eee;
  padding: 0 10px;
}
</style>