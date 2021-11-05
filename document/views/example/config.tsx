import { ComponentInternalInstance } from 'vue'
import { FormField, reset } from '@dongls/xform'

type DesignerSlotState = {
  isWide: any,
  validateSchema: any,
  reset: any,
  clear: any,
  viewJson: any
}

type BuilderSlotState = {
  pending: any,
  disabled: any,
  validator: any,
  disableForm: any,
  viewJSON: any
}

type Config = {
  version: string,
  source: any[],
  factory: () => Promise<any>,
  install: (preset: any, instance: ComponentInternalInstance) => void,
  renderDesignerToolSlot?: (state: DesignerSlotState) => any,
  renderBuilderDefaultSlot?: (state: BuilderSlotState) => any,
  renderBuilderFooterSlot?: (state: BuilderSlotState) => any,
  renderViewerDefaultSlot?: (state: BuilderSlotState) => any
}

export const enum TYPE {
  STYLE = 1,
  SCRIPT = 2
}

const MODES = {
  example: [
    {
      title: '基础字段',
      types: ['text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'date']
    },
    {
      title: '辅助字段',
      types: ['divider', 'group', 'tabs', 'datatable']
    }
  ],
  simple: ['text', 'textarea', 'number', 'select']
}

const publicPath = __IS_DEV__ ? '/docs' : '/xForm'
export const config = new Map<string, Config>()
export const DEAFULT_TARGET = 'bootstrap'

config.set('bootstrap', {
  version: '4.6.0',
  source: [
    [publicPath + '/libs/bootstrap/bootstrap.min.css', TYPE.STYLE],
    [publicPath + '/libs/bootstrap/jquery.slim.min.js', TYPE.SCRIPT],
    [publicPath + '/libs/bootstrap/popper.min.js', TYPE.SCRIPT],
    [publicPath + '/libs/bootstrap/bootstrap.min.js', TYPE.SCRIPT]
  ],
  factory(){
    return import(/* webpackPrefetch: true */'./bootstrap/index').then(r => r.default)
  },
  install(preset){
    reset({ preset, config: { modes: MODES } })
  },
  renderDesignerToolSlot(state){
    return (
      <div class="example-designer-tool">
        <div class="example-designer-tool-left">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="prop-is-wide" v-model={state.isWide.value}/>
            <label class="custom-control-label" for="prop-is-wide">宽屏</label>
          </div>
        </div>
        <div class="example-designer-tool-right">
          <button type="button" class="btn btn-link btn-text btn-sm" onClick={state.validateSchema}>验证</button>
          <button type="button" class="btn btn-link btn-text btn-sm" onClick={state.reset}>重置</button>
          <button type="button" class="btn btn-link btn-text btn-sm" onClick={state.clear}>清空</button>
          <button type="button" class="btn btn-link btn-text btn-sm" onClick={state.viewJson}>查看JSON</button>
        </div>
      </div>
    )
  },
  renderBuilderDefaultSlot(state){
    const slots = {
      default(ctx: { field: FormField, disabled: boolean }){
        const { field, disabled } = ctx
        return [
          <input v-model={field.value} type="text" class="form-control form-control-sm" placeholder="详细地址" disabled={disabled}/>,
          <p class="example-builder-tip">该字段并非由设计器生成，而是页面单独添加的字段</p>
        ]
      }
    }

    return (
      <xform-item name="address" title="地址" validation={state.validator} disabled={state.disabled.value} virtual>
        {slots}
      </xform-item>
    )
  },
  renderBuilderFooterSlot(state){
    return (
      <div class="example-builder-footer">
        <button type="button" class="btn btn-link btn-text btn-sm" disabled={state.pending.value} onClick={state.viewJSON}>查看JSON</button>
        <button type="button" class="btn btn-link btn-text btn-sm" onClick={state.disableForm}>{ state.disabled.value ? '启用' : '禁用' }表单</button>
        <button type="reset" class="btn btn-light btn-text btn-sm" disabled={state.pending.value || state.disabled.value}>重置</button>
        <button type="submit" class="btn btn-primary btn-sm" disabled={state.pending.value || state.disabled.value}>提交</button>
      </div>
    )
  }
})

config.set('element-plus', {
  version: 'v1.2.0-beta.1',
  source: [
    [publicPath + '/libs/element-plus/index.css', TYPE.STYLE],
    [publicPath + '/libs/element-plus/index.js', TYPE.SCRIPT],
  ],
  factory(){
    return import(/* webpackPrefetch: true */'./element-plus/index').then(r => r.default)
  },
  install(preset, instance: ComponentInternalInstance){
    const ElementPlus = (window as any).ElementPlus
    if(ElementPlus) instance.appContext.app.use(ElementPlus)

    reset({ preset, config: { modes: MODES } })
  },
  renderDesignerToolSlot(state){
    return (
      <div class="example-designer-tool">
        <div class="example-designer-tool-left">
          <el-checkbox v-model={state.isWide.value}>宽屏</el-checkbox>
        </div>
        <div class="example-designer-tool-right">
          <el-button size="small" onClick={state.validateSchema} type="text">验证</el-button>
          <el-button size="small" onClick={state.reset} type="text">重置</el-button>
          <el-button size="small" onClick={state.clear} type="text">清空</el-button>
          <el-button size="small" onClick={state.viewJson} type="text">查看JSON</el-button>
        </div>
      </div>
    )
  },
  renderBuilderFooterSlot(state){
    return (
      <div class="example-builder-footer">
        <el-button type="text" size="small" disabled={state.pending.value} onClick={state.viewJSON}>查看JSON</el-button>
        <el-button type="text" size="small" onClick={state.disableForm}>{ state.disabled.value ? '启用' : '禁用' }表单</el-button>
        <el-button size="small" disabled={state.pending.value || state.disabled.value}>重置</el-button>
        <el-button type="primary" size="small" native-type="submit" disabled={state.pending.value || state.disabled.value}>提交</el-button>
      </div>
    )
  }
})

config.set('antdv', {
  version: '2.1.2',
  source: [
    [publicPath + '/libs/antdv/antd.min.css', TYPE.STYLE],
    [publicPath + '/libs/antdv/antd.min.js', TYPE.SCRIPT],
  ],
  factory(){
    return import(/* webpackPrefetch: true */'../../../packages/antdv').then(r => r.default)
  },
  install(preset){
    reset({ preset, config: { modes: MODES } })
  }
})