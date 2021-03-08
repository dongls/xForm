<script lang="ts">
import { useLocalSchema, useLocalModel } from '@document/util/common'
import { getCurrentInstance, ref, defineComponent } from 'vue'
import { XField, XFormModel } from '@dongls/xform'

export default defineComponent({
  name: 'builder-view',
  emits: ['view'],
  setup(props, { emit }){
    const instance = getCurrentInstance()
    const { schema } = useLocalSchema()
    const model = useLocalModel()
    const pending = ref(false)

    const viewJSON = function(){
      emit('view', { title: 'Form JSON', json: JSON.stringify(model.value, null, ' ') })
    }

    return {
      schema, 
      model,
      pending,
      reset(){
        (instance.refs.builder as any).reset()
      },
      viewJSON,
      submit(validate: Function, model: XFormModel){
        pending.value = true
        return validate().then((r: any) => {
          console.log('validate result: ', r, model)
          if(r.valid) viewJSON()
        }).finally(() => pending.value = false)
      },
      // field: reactive(new XField({
      //   type: 'text',
      //   name: 'field3',
      //   title: '测试三',
      //   required: true
      // })),
      validator(field: XField, model: XFormModel){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const value = model[field.name]
            if(!value) return reject('必填')

            resolve(null)
          }, 1000)
        })
      }
    }
  }
})
</script>

<template>
  <xform-builder 
    ref="builder"
    v-model:model="model"
    :schema="schema" 
    class="example-builder"
    @submit="submit"
  >
    <template #header>
      <h3 class="example-builder-title">笔记本电脑报修单</h3>
    </template>

    <!-- <template #type_divider><hr></template> -->

    <xform-item name="address" title="地址" :validation="validator" required>
      <input v-model="model.address" type="text" class="form-control form-control-sm" placeholder="详细地址">
      <p class="example-builder-tip">该字段并非由设计器生成，而是页面单独添加的字段</p>
    </xform-item>
    <!-- <xform-item :field="field" validation/> -->
    
    <template #footer>
      <div class="example-builder-footer">
        <button type="button" class="btn btn-link btn-text btn-sm" :disabled="pending" @click="viewJSON">查看JSON</button>
        <button type="reset" class="btn btn-light btn-text btn-sm" :disabled="pending">重置</button>
        <button type="submit" class="btn btn-primary btn-sm" :disabled="pending">提交</button>
      </div>
    </template>
  </xform-builder>
</template>

<style>
.example-builder{
  padding: 10px 0;
}

.example-builder-footer{
  margin-top: 10px;
  text-align: right;
}

.example-builder-footer button{
  min-width: 72px;
}

.example-builder-footer button + button{
  margin-left: 10px;
}

.example-builder-title{
  font-size: 18px;
  text-align: center;
  margin: 10px 0 15px 0;
  font-weight: 700;
}

.example-builder-tip{
  margin: 0;
  font-size: 14px;
  color: rgb(250, 187, 70);
}
</style>