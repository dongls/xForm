import { watch, computed, ref } from 'vue'
import { XFormModel } from '@core/model'
import { createSchema } from '@core/index'

import DEFAULT_SCHEMA from './schema.data'

const XFORM_SCHEMA_STORAGE_KEY = '__xform_schema_storage__'
const XFORM_MODEL_STORAGE_KEY = '__xform_model_storage__'

function saveToLocalStorage(key: string, value: string){
  localStorage.setItem(key, value)
}

function getLocalSchema(){
  const str = localStorage.getItem(XFORM_SCHEMA_STORAGE_KEY)
  try {
    const schema: any = JSON.parse(str)
    if(
      null == schema || 
      Object.keys(schema).length == 0 || 
      !Array.isArray(schema.fields) || 
      schema.fields.length == 0
    ) throw new Error

    return createSchema(schema)
  } catch (error) {
    const source = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
    const schema = createSchema(source)
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
  const schema = getLocalSchema()
  watch(schema, value => {
    saveToLocalStorage(XFORM_SCHEMA_STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  return {
    schema,
    schemaJSON: computed(() => JSON.stringify(schema, null, '  ')),
    reset: () => Object.keys(schema).forEach(prop => {
      if(prop == 'fields') schema[prop] = []
      else delete schema[prop]
    })
  }
}

export function useLocalModel(readonly = false){
  const localModel = getLocalModel()
  const model = ref<XFormModel>(localModel)

  if(!readonly) {
    watch(model, () => saveToLocalStorage(XFORM_MODEL_STORAGE_KEY, JSON.stringify(model.value)), { deep: true })
  }

  return model
}