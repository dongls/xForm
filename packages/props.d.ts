import { FormSchema, FormField } from './core'
import { FormScope } from './core/model'

declare global {
  interface Element{
    __PROP_XFORM_DRAGE_MODE__: string
    __PROP_XFORM_FIELD__: FormField
    __PROP_XFORM_FIELD_TYPE__: string
    __PROP_XFORM_SCHEMA__: FormSchema
    __PROP_XFORM_SCOPE__: FormScope
  }
}