import { ref, watch } from 'vue'
import { createSchema, createSchemaRef } from '@dongls/xform'
import DEFAULT_SCHEMA from './schema.data'

const SCHEMA_KEY = 'schema'
const MODEL_KEY = 'model'
const IS_WIDE_KEY = 'is_wide'

const isWide = ref(getLocalIsWide())

watch(isWide, v => saveToLocalStorage(IS_WIDE_KEY, v))

function saveToLocalStorage(key: string, value: any){
  localStorage.setItem(key, JSON.stringify(value))
}

function createDefaultSchema(){
  return JSON.parse(JSON.stringify(DEFAULT_SCHEMA))
}

function getLocalSchema(withModel: boolean){
  const str = localStorage.getItem(SCHEMA_KEY)
  try {
    const schema: any = JSON.parse(str)
    if(
      null == schema || 
      Object.keys(schema).length == 0 || 
      !Array.isArray(schema.fields) || 
      schema.fields.length == 0
    ) throw new Error('get local schema')

    return createSchemaRef(schema, withModel ? getLocalModel() : null)
  } catch (error) {
    __IS_DEV__ && console.warn(error.message)
    const schema = createSchemaRef(createDefaultSchema())
    saveToLocalSchema(schema.value)
    return schema
  }
}

function getLocalModel(){
  try {
    const str = localStorage.getItem(MODEL_KEY)
    return JSON.parse(str) || {}
  } catch (error) {
    return {}
  }
}

function getLocalIsWide(){
  try {
    const data = localStorage.getItem(IS_WIDE_KEY)
    return JSON.parse(data) ?? false
  } catch (error) {
    return false
  }
}

export function saveToLocalModel(model: any){
  saveToLocalStorage(MODEL_KEY, model)
}

export function saveToLocalSchema(schema: any){
  saveToLocalStorage(SCHEMA_KEY, schema)
}

export function useIsWide(){
  return isWide
}

export function useLocalSchema(withModel = true){
  const schema = getLocalSchema(withModel)

  watch(schema, v => saveToLocalSchema(v), { deep: true })

  return {
    schema,
    resetSchema: () => schema.value = createSchema(createDefaultSchema())
  }
}

