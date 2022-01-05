import { ComponentInternalInstance } from 'vue'
import { FormField, reset } from '@dongls/xform'
import { toTrue } from '@document/util/common'
import { Options as NotifyOptions } from '@document/component/Notification/index'

export type ConfirmFunc = (message: string, title: string) => Promise<boolean>
export type NotifyFunc = (o: NotifyOptions) => void

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

export type Config = {
  IS_DEV?: boolean,
  id: string,
  name: string,
  version: string,
  homepage: string,
  source: any[],
  factory: () => Promise<any>,
  install: (preset: any, instance: ComponentInternalInstance) => void,
  renderDesignerToolSlot?: (state: DesignerSlotState) => any,
  renderBuilderDefaultSlot?: (state: BuilderSlotState) => any,
  renderBuilderFooterSlot?: (state: BuilderSlotState) => any,
  renderViewerDefaultSlot?: (state: BuilderSlotState) => any,
  confirm?: ConfirmFunc,
  notify?: NotifyFunc
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
export const DEAFULT_TARGET = 'element-plus'

function getElementPlus(){
  const win = window as any
  const ElementPlus = win.ElementPlus
  ElementPlus.ElementPlusLocaleZhCn = win.ElementPlusLocaleZhCn
  return ElementPlus
}

function r(c: Config){
  config.set(c.id, c)
}

r({
  id: 'bootstrap',
  name: 'Bootstrap',
  version: '5.1.3',
  homepage: 'https://github.com/twbs/bootstrap',
  source: [
    [publicPath + '/libs/bootstrap/bootstrap.min.css', TYPE.STYLE],
    [publicPath + '/libs/bootstrap/bootstrap.bundle.min.js', TYPE.SCRIPT],
  ],
  factory(){
    return import(/* webpackPrefetch: true */'./bootstrap/index').then(r => r.default)
  },
  install(preset){
    reset({ preset, config: { logic: true, modes: MODES } })
  },
  renderDesignerToolSlot(state){
    return (
      <div class="example-designer-tool">
        <div class="example-designer-tool-left">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="prop-is-wide" v-model={state.isWide.value}/>
            <label class="form-check-label" for="prop-is-wide">宽屏</label>
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
      <xform-item name="address" title="地址" validation={state.validator} disabled={state.disabled.value} required virtual>
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

r({
  id: 'element-plus',
  name: 'Element Plus',
  version: 'v2.2.2',
  homepage: 'https://github.com/element-plus/element-plus',
  source: [
    [publicPath + '/libs/element-plus/2.2.2/index.css', TYPE.STYLE],
    [publicPath + '/libs/element-plus/2.2.2/index.full.min.js', TYPE.SCRIPT],
    [publicPath + '/libs/element-plus/2.2.2/zh-cn.min.js', TYPE.SCRIPT],
  ],
  factory(){
    return import(/* webpackPrefetch: true */'./element-plus/index').then(r => r.default)
  },
  install(preset, instance: ComponentInternalInstance){
    const ElementPlus = getElementPlus()
    if(ElementPlus) {
      instance.appContext.app.use(ElementPlus, { 
        locale: ElementPlus.ElementPlusLocaleZhCn
      })
    }

    reset({ preset, config: { logic: true, modes: MODES } })
  },
  renderDesignerToolSlot(state){
    return (
      <div class="example-designer-tool">
        <div class="example-designer-tool-left">
          <el-checkbox v-model={state.isWide.value}>宽屏</el-checkbox>
        </div>
        <div class="example-designer-tool-right">
          <el-button onClick={state.validateSchema} type="primary" link>验证</el-button>
          <el-button onClick={state.reset} type="primary" link>重置</el-button>
          <el-button onClick={state.clear} type="primary" link>清空</el-button>
          <el-button onClick={state.viewJson} type="primary" link>查看JSON</el-button>
        </div>
      </div>
    )
  },
  renderBuilderDefaultSlot(state){
    const slots = {
      default(ctx: { field: FormField, disabled: boolean }){
        const { field, disabled } = ctx
        return [
          <el-input v-model={field.value} placeholder="详细地址" disabled={disabled}/>,
          <p class="example-builder-tip">该字段并非由设计器生成，而是页面单独添加的字段</p>
        ]
      }
    }

    return (
      <xform-item name="address" title="地址" validation={state.validator} disabled={state.disabled.value} required={true} virtual>
        {slots}
      </xform-item>
    )
  },
  renderBuilderFooterSlot(state){
    return (
      <div class="example-builder-footer">
        <el-button type="primary" text disabled={state.pending.value} onClick={state.viewJSON}>查看JSON</el-button>
        <el-button type="primary" text onClick={state.disableForm}>{ state.disabled.value ? '启用' : '禁用' }表单</el-button>
        <el-button native-type="reset" disabled={state.pending.value || state.disabled.value}>重置</el-button>
        <el-button type="primary" native-type="submit" disabled={state.pending.value || state.disabled.value}>提交</el-button>
      </div>
    )
  },
  confirm(message, title){
    return getElementPlus().ElMessageBox.confirm(
      message,
      title,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'example-el-confirm'
      }
    ).then(toTrue)
  },
  notify(options){
    return getElementPlus().ElNotification({
      title: options.title,
      duration: options.delay,
      message: options.content || options.message,
      type: options.type,
      customClass: 'example-el-notify'
    })
  }
})

r({
  IS_DEV: true,
  id: 'antdv',
  name: 'Ant Design Vue',
  version: '2.1.2',
  homepage: 'https://github.com/vueComponent/ant-design-vue',
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