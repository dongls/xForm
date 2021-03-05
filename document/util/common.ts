import { watch, computed, ref } from 'vue'
import { XFormModel, createSchema } from '@dongls/xform'

import DEFAULT_SCHEMA from './schema.data'

const XFORM_SCHEMA_STORAGE_KEY = '__xform_schema_storage__'
const XFORM_MODEL_STORAGE_KEY = '__xform_model_storage__'

function saveToLocalStorage(key: string, value: string){
  localStorage.setItem(key, value)
}

export function createDefaultSchema(){
  const o = JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
  return createSchema(o)
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

    return ref(createSchema(schema))
  } catch (error) {
    const schema = ref(createDefaultSchema())
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

  watch(
    schema, 
    value => saveToLocalStorage(XFORM_SCHEMA_STORAGE_KEY, JSON.stringify(value)), 
    { deep: true }
  )

  return {
    schema,
    schemaJSON: computed(() => JSON.stringify(schema.value, null, '  '))
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