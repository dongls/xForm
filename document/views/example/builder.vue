<script lang="ts">
import { getCurrentInstance, ref, defineComponent } from 'vue'
import { XField } from '@dongls/xform'
import { useLocalSchema, saveToLocalModel } from '@document/util/common'

export default defineComponent({
  name: 'builder-view',
  emits: ['view'],
  setup(props, { emit }){
    const instance = getCurrentInstance()
    const { schema } = useLocalSchema()
    const pending = ref(false)

    const viewJSON = function(){
      const model = schema.value.model
      emit('view', { title: 'Form JSON', json: JSON.stringify(model, null, '  ') })
    }

    return {
      schema, 
      pending,
      change(/* e: any */){
        // console.log(`${e.field.name}[${e.field.title}] value change:`, e.field.value,)
        saveToLocalModel(schema.value.model)
      },
      reset(){
        (instance.refs.builder as any).reset()
      },
      viewJSON,
      submit(validate: Function){
        pending.value = true
        return validate().then((r: { valid: boolean, model: any }) => {
          console.info('validate result: ', r)
          if(r.valid) viewJSON()
        }).finally(() => pending.value = false)
      },
      // field: reactive(new XField({
      //   type: 'text',
      //   name: 'field3',
      //   title: '测试三',
      //   required: true
      // })),
      validator(field: XField, value: any){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
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
    :schema="schema" 
    class="example-builder"
    @value:change="change"
    @submit="submit"
  >
    <template #header>
      <h3 class="example-builder-title">笔记本电脑报修单</h3>
    </template>

    <!-- <template #type_divider><hr></template> -->

    <xform-item name="address" title="地址" :validation="validator" virtual>
      <template #default="{field}">
        <input v-model="field.value" type="text" class="form-control form-control-sm" placeholder="详细地址">
        <p class="example-builder-tip">该字段并非由设计器生成，而是页面单独添加的字段</p>
      </template>
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
  padding: 15px 0;
}

.example-builder-footer{
  margin-top: 20px;
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