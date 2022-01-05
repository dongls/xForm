<script lang="tsx">
import { ref, defineComponent, nextTick } from 'vue'
import { FormField, FormBuilderApi } from '@dongls/xform'
import { useLocalSchema, saveToLocalModel } from '@document/util/common'
import { useBuilderDefaultSlot, useBuilderFooterSlot, useTarget } from './preset'

export default defineComponent({
  name: 'builder-view',
  emits: ['view'],
  setup(props, { emit }){
    const { schema } = useLocalSchema()
    const pending = ref(false)
    const disabled = ref(false)
    const builder = ref<FormBuilderApi>()
    const target = useTarget()
    const state = {
      pending,
      disabled,
      validator,
      disableForm,
      viewJSON
    }

    const footerSlot = useBuilderFooterSlot(target, state)
    const defaultSlot = useBuilderDefaultSlot(target, state)

    function viewJSON(){
      const model = schema.value.model
      emit('view', { title: 'Form JSON', json: JSON.stringify(model, null, '  ') })
    }

    function reset(){
      builder.value.reset()
    }

    function change(){
      nextTick(() => saveToLocalModel(schema.value.model))
    }

    function submit(validate: Function){
      pending.value = true
      return validate().then((r: { valid: boolean, model: any }) => {
        console.info('validate result: ', r)
        if(r.valid) viewJSON()
      }).finally(() => pending.value = false)
    }

    function disableForm(){
      disabled.value = !disabled.value
      if(disabled.value) reset()
    }

    function validator(field: FormField, value: any){
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!value) return reject('必填')

          resolve(null)
        }, 1000)
      })
    }

    return function(){
      const slots = {
        header: () => <h3 class="example-builder-title">笔记本电脑报修单</h3>,
        footer: footerSlot,
        default: defaultSlot
      }

      return (
        <xform-builder 
          ref={builder}
          class="example-builder"
          schema={schema.value}
          disabled={disabled.value}
          onSubmit={submit}
          {...{ 'onValue:change': change }}
        >{slots}</xform-builder>
      )
    }
  }
})
</script>

<style>
.example-builder{
  padding: 15px 0 65px 0;
  max-width: 640px;
}

.is-wide .example-builder{
  width: calc(100vw - 702px);
  max-width: none;
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