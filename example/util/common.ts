import { watch, computed, reactive } from 'vue'
import { XField, XFormModel, XFormSchema } from '@core/model'

import DEFAULT_SCHEMA from './schema.data'

const XFORM_SCHEMA_STORAGE_KEY = '__xform_schema_storage__'
const XFORM_MODEL_STORAGE_KEY = '__xform_model_storage__'

function saveToLocalStorage(key: string, value: string){
  localStorage.setItem(key, value)
}

function toXField(f: any): XField{
  return f instanceof XField ? f : new XField(f)
}

function toXFormSchema(schema: any){
  schema.fields = schema.fields.map(toXField)
  return schema as XFormSchema
}

function getLocalSchema(): XFormSchema{
  const str = localStorage.getItem(XFORM_SCHEMA_STORAGE_KEY)
  try {
    const schema: any = JSON.parse(str)
    if(
      null == schema || 
      Object.keys(schema).length == 0 || 
      !Array.isArray(schema.fields) || 
      schema.fields.length == 0
    ) throw new Error

    return toXFormSchema(schema)
  } catch (error) {
    const source = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
    const schema = toXFormSchema(source)
    saveToLocalStorage(XFORM_SCHEMA_STORAGE_KEY, JSON.stringify(schema))
    return schema
  }
}

function getLocalModel(){
  try {
    const str = localStorage.getItem(XFORM_MODEL_STORAGE_KEY)
    return JSON.parse(str) || {}
  } catch (error) {
    return {}
  }
}

export function useLocalSchema(){
  const localSchema = getLocalSchema()
  const schema = reactive<XFormSchema>(localSchema)
  watch(schema, value => {
    saveToLocalStorage(XFORM_SCHEMA_STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  return {
    schema,
    schemaJSON: computed(() => JSON.stringify(schema, null, '  ')),
    reset: () => Object.keys(schema).forEach(prop => delete schema[prop])
  }
}

export function useLocalModel(readonly = false){
  const localModel = getLocalModel()
  const value = reactive<XFormModel>(localModel)
  const o: any = { value, reset: null }

  if(!readonly) {
    watch(value, () => saveToLocalStorage(XFORM_MODEL_STORAGE_KEY, JSON.stringify(value)), { deep: true })
    o.reset = () => Object.keys(value).forEach(prop => delete value[prop])
  }

  return o
}