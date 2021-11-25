import { defineComponent } from 'vue'
import { isEmpty } from '../../util'
import { Field, FormField } from '../../model'
import { useApi } from '../../api/Exports'

export function mockFields(){
  return [
    {
      type: 'text',
      title: '单行文本',
      icon: 'icon-text',
      preview: <div>preview for text</div>,
      build: defineComponent({
        name: 'test-text',
        props: {
          field: FormField
        },
        setup(props){
          return function(){
            return <input type="text" v-model={props.field.value}/>
          }
        }
      }),
      setting: <div>setting for text</div>,
      validator(field: FormField, value: any){
        if(field.required && isEmpty(value)) return Promise.reject('必填')
        return Promise.resolve()
      }
    },
    {
      type: 'textarea',
      title: '多行文本',
      icon: 'icon-textarea',
      preview: <div>preview for textarea</div>,
      build: <div>build for textarea</div>,
      setting: <div>setting for textarea</div>,
    },
    {
      type: 'select',
      title: '下拉框',
      icon: 'icon-select',
      preview: <div>preview for select</div>,
      build: <div>build for select</div>,
      setting: <div>setting for select</div>,
    },
  ].map(Field.create)
}

export function mockOption(){
  const fields = mockFields()
  return {
    fields,
    preset: {
      name: 'test',
      install(){
        const api = useApi()
        api.registerField(fields)
        return function(){
          fields.forEach(api.removeField)
        }
      }
    },
    config: {
      modes: {
        simple: ['text', 'textarea'],
        group: [
          { title: '文本字段', types: ['text', 'textarea'] },
          { title: '选择字段', types: ['select'] }
        ]
      }
    }
  }
}

export function mockSchema(){
  return {
    fields: [
      {
        type: 'text',
        name: 'field_text01',
        title: '单行文本一'
      },
      {
        type: 'textarea',
        name: 'field_textarea01',
        title: '多行文本一'
      },
      {
        type: 'select',
        name: 'field_select01',
        title: '下拉框',
        options: [
          { value: '选项一' },
          { value: '选项二' },
          { value: '选项三' }
        ]
      },
      {
        type: 'text',
        name: 'field_text02',
        title: '单行文本二'
      },
      {
        type: 'textarea',
        name: 'field_textarea02',
        title: '多行文本二'
      }
    ]
  }
}