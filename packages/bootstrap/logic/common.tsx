import classes from './index.module.scss'
import { FormField, FormFieldLogic, useConstant } from '@dongls/xform'

const { CLASS } = useConstant()

export function createWarnTip(logic: FormFieldLogic, field: FormField){
  const targetField = field.parent.find(logic.field)
  if(targetField == null) return <div class={CLASS.IS_WARNING}>当前逻辑失效，目标字段被删除或位置发生变化</div>
  
  const title = <strong class={classes.warnFieldTitle}>{targetField.title}</strong>
  return <div class={CLASS.IS_WARNING}>当前逻辑失效，目标字段{title}的位置发生变化</div>
}