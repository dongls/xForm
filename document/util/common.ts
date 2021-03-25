import { ref, watch } from 'vue'
import { createSchema, createSchemaRef } from '@dongls/xform'
import DEFAULT_SCHEMA from './schema.data'

const XFORM_SCHEMA_STORAGE_KEY = '__xform_schema_storage__'
const XFORM_MODEL_STORAGE_KEY = '__xform_model_storage__'
const XFORM_IS_WIDE_KEY = '__xform_is_wide__'

function saveToLocalStorage(key: string, value: string){
  localStorage.setItem(key, value)
}

function createDefaultSchema(){
  return JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
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
    ) throw new Error('get local schema')

    return createSchemaRef(schema, getLocalModel())
  } catch (error) {
    console.error(error)
    const schema = createSchemaRef(createDefaultSchema())
    saveToLocalSchema(schema.value)
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

function getLocalIsWide(){
  try {
    const data = localStorage.getItem(XFORM_IS_WIDE_KEY)
    return JSON.parse(data) ?? false
  } catch (error) {
    return false
  }
}

export function saveToLocalModel(model: any){
  saveToLocalStorage(XFORM_MODEL_STORAGE_KEY, JSON.stringify(model))
}

export function saveToLocalSchema(schema: any){
  saveToLocalStorage(XFORM_SCHEMA_STORAGE_KEY, JSON.stringify(schema))
}

const isWide = ref(getLocalIsWide())
watch(isWide, v => saveToLocalStorage(XFORM_IS_WIDE_KEY, JSON.stringify(v)))
export function useIsWide(){
  return isWide
}

export function useLocalSchema(){
  const schema = getLocalSchema()

  watch(schema, v => saveToLocalSchema(v), { deep: true })

  return {
    schema,
    reset: () => schema.value = createSchema(createDefaultSchema())
  }
}