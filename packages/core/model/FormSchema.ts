import {
  clonePlainObject,
  isEmpty,
  isFunction,
  isNull,
  mixinRestParams,
  parseMessage,
} from '../util/lang'
import { Serializable } from './Serializable'
import { FormField } from './FormField'
import { FormScope } from './FormScope'
import { Action } from './action'

type SchemaValidResult = {
  valid: boolean
  title: string
  name: string
  index: number
  message: string
  fields?: SchemaValidResult[]
}

type Callback = (action: Action) => void

type PrivateProps = {
  callbacks: Callback[]
}

function createSchemaValidResult(
  error: unknown,
  field: FormField,
  index: number,
  r?: SchemaValidResult[]
) {
  const message = parseMessage(error)
  const result = {
    valid: message == null,
    title: field.title,
    name: field.name,
    index,
    message,
  } as SchemaValidResult

  if (Array.isArray(r) && r.length > 0) result.fields = r
  return result
}

/** 默认只验证title字段 */
function defaultValidate(field: FormField) {
  return isEmpty(field.title) ? Promise.reject('标题为空') : Promise.resolve()
}

function validateFields(fields: FormField[]): Promise<SchemaValidResult[]> {
  if (fields.length == 0) return Promise.resolve(null)

  const promises = fields.map((field, index) => {
    const onValidate = field.conf?.onValidate
    const hook = isFunction(onValidate) ? onValidate : defaultValidate

    return validateFields(field.fields).then((r: any) => {
      return hook(field)
        .then(() => createSchemaValidResult(null, field, index, r))
        .catch(e => createSchemaValidResult(e, field, index, r))
    })
  })

  return Promise.all(promises).then(r => {
    return r.filter(i => !i.valid || (i.valid && i.fields != null))
  })
}

const PRIVATE_PROPS_KEY = Symbol()

export class FormSchema extends FormScope {
  [prop: string]: any

  private props: (key: Symbol) => PrivateProps

  parent: null
  fields: FormField[]
  external: FormField[] = []

  labelSuffix?: string
  labelPosition?: string
  viewerPlaceholder?: string

  static [Serializable.EXCLUDE_PROPS_KEY] = ['external']

  constructor(o: any, _model?: any) {
    super()

    const props: PrivateProps = { callbacks: [] }
    const model = _model ?? {}

    this.labelSuffix = o.labelSuffix
    this.labelPosition = o.labelPosition
    this.viewerPlaceholder = o.viewerPlaceholder

    this.createFields(o.fields, (f) => FormField.create(f, model[f.name]))
    mixinRestParams(this, o)

    this.props =  function(key: Symbol): PrivateProps{
      if(key !== PRIVATE_PROPS_KEY){
        console.warn('`Formschema.props` is a private function, you should not call the function.')
        return null
      }
      
      return props
    }
  }

  get model() {
    return [...this.fields, ...this.external].reduce((acc, field) => {
      const value = field.value
      return isNull(value) ? acc : (acc[field.name] = value, acc)
    }, {} as any)
  }

  get root(){
    return this
  }

  registerExternalField(field: FormField) {
    const index = this.external.indexOf(field)
    if (index < 0) {
      this.external.push(field)
      field.parent = this
    }
  }

  getNeedValidateFields() {
    return [...this.fields, ...this.external].filter((f) => f.state.mounted)
  }

  /**
   * 根据自身值创建一个新的schema，不包括以下属性：
   * - fields 字段
   * - Serializable.EXCLUDE_PROPS_KEY 中包含的属性
   */
  genSchema(raw: any, model?: any) {
    const exclude = FormSchema[Serializable.EXCLUDE_PROPS_KEY]

    for (const key in this) {
      if (key == 'fields' || exclude.indexOf(key) >= 0) continue

      const o = raw[key]
      const v = this[key]
      raw[key] = isNull(o) ? clonePlainObject(v) : o
    }

    return new FormSchema(raw, model)
  }

  /** 验证schema的完整性 */
  validate(): Promise<{ valid: boolean; result: SchemaValidResult[] }> {
    if (this.fields.length == 0)
      return Promise.resolve({ valid: true, result: [] })

    return validateFields(this.fields).then((r) => {
      return {
        valid: r.length == 0,
        result: r,
      }
    })
  }

  useEffect(callback: Callback) {
    const callbacks = this.props(PRIVATE_PROPS_KEY).callbacks
    if(callbacks.indexOf(callback) < 0){
      callbacks.push(callback)
    }

    return function() {
      const index = callbacks.indexOf(callback)
      if (index >= 0) callbacks.splice(index, 1)
    }
  }

  /** 总是返回空数组 */
  previous(): FormField[] {
    return []
  }

  find(name: string) {
    return this.fields.find((f) => f.name === name)
  }

  dispatch(action: Action) {
    const callbacks = this.props(PRIVATE_PROPS_KEY).callbacks
    callbacks.forEach(callback => callback(action))
  }
}
