<script lang="ts">
import { useLocalSchema, useLocalModel } from '../util/common'
import { getCurrentInstance, ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'builder-view',
  setup(props, { emit }){
    const { schema } = useLocalSchema()
    const { value, reset } = useLocalModel()
    const instance = getCurrentInstance()
    const pending = ref(false)
    
    const viewJSON = function(){
      emit('view', { title: 'Form JSON', json: JSON.stringify(value, null, ' ') })
    }

    return {
      schema, 
      value,
      pending,
      reset,
      viewJSON,
      submit(){
        const builder = instance.refs.builder as any

        pending.value = true
        return builder.validate()
          .then((messages: any) => {
            console.log('validate:', messages)
            if(messages.every((i: any) => i === true)) viewJSON()
          })
          .finally(() => pending.value = false)
      }
    }
  }
})
</script>

<template>
  <xform-builder ref="builder" v-model:value="value" :schema="schema" class="example-builder" @submit.prevent="submit">
    <template #footer>
      <div class="example-builder-footer">
        <button type="button" class="btn btn-link btn-text btn-sm" @click="viewJSON">查看JSON</button>
        <button type="button" class="btn btn-light btn-text btn-sm" @click="reset">重置</button>
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
</style>