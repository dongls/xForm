import { clonePlainObject, isEmpty, isFunction, isNull, mixinRestParams, parseMessage } from '../util/lang'
import { Serializable } from './base'
import { XField } from './XField'

type SchemaValidResult = {
  valid: boolean;
  title: string;
  name: string;
  index: number;
  message: string;
  fields?: SchemaValidResult[]
}

function createSchemaValidResult(error: unknown, field: XField, index: number, r?: SchemaValidResult[]){
  const message = parseMessage(error)
  const result = {
    valid: message == null,
    title: field.title,
    name: field.name,
    index,
    message
  } as SchemaValidResult

  if(Array.isArray(r) && r.length > 0) result.fields = r
  return result
}

/** 默认只验证title字段 */
function defaultValidate(field: XField){
  return isEmpty(field.title) ? Promise.reject('标题为空') : Promise.resolve()
}

function validateFields(fields: XField[]): Promise<SchemaValidResult[]>{
  if(fields.length == 0) return Promise.resolve(null)

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
    return r.filter(i => !i.valid || i.valid && i.fields != null )
  })
}

export class XSchema extends Serializable{
  [prop: string]: any;
  fields: XField[];
  external: XField[] = [];

  labelSuffix?: string;
  labelPosition?: string;
  viewerPlaceholder?: string;

  static [Serializable.EXCLUDE_PROPS_KEY] = ['external']

  constructor(o: any, _model?: any){
    super()
    
    const model = _model ?? {}

    this.fields = (
      Array.isArray(o.fields) 
        ? o.fields.map((f: any) => XField.create(f, model[f.name])) 
        : []
    )

    this.labelSuffix = o.labelSuffix
    this.labelPosition = o.labelPosition
    this.viewerPlaceholder = o.viewerPlaceholder

    mixinRestParams(this, o)
  }

  get model(){
    return [...this.fields, ...this.external].reduce((acc, field) => {
      const fc = field.conf
      const value = isFunction(fc?.onValueSubmit) ? fc.onValueSubmit(field) : field.value
      return isNull(value) ? acc : (acc[field.name] = value, acc)
    }, {} as any)
  }

  registerExternalField(field: XField){
    const index = this.external.indexOf(field)
    if(index < 0) this.external.push(field)
  }

  getNeedValidateFields(){
    return [...this.fields, ...this.external].filter(f => f.state.mounted)
  }

  /** 
   * 根据自身值创建一个新的schema，不包括以下属性：
   * - fields 字段
   * - Serializable.EXCLUDE_PROPS_KEY 中包含的属性
   */
  genSchema(raw: any, model?: any){
    const exclude = XSchema[Serializable.EXCLUDE_PROPS_KEY]

    for(const key in this){
      if(key == 'fields' || exclude.indexOf(key) >= 0) continue
      
      const o = raw[key]
      const v = this[key]
      raw[key] = isNull(o) ? clonePlainObject(v) : o
    }

    return new XSchema(raw, model)
  }

  /** 验证schema的完整性 */
  validate(): Promise<{ valid: boolean, result: SchemaValidResult[] }>{
    if(this.fields.length == 0) return Promise.resolve({ valid: true, result: [] })

    return validateFields(this.fields).then(r => {
      return {
        valid: r.length == 0,
        result: r
      }
    })
  }
}

export type XFormSchema = InstanceType<typeof XSchema>