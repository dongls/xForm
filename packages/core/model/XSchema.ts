import { isFunction, isNull, mixinRestParams } from '../util'
import { Serializable } from './base'
import { XField } from './XField'

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
    return [...this.fields, ...this.external].filter(f => f.mounted)
  }
}

export type XFormSchema = InstanceType<typeof XSchema>