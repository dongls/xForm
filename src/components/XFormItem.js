import * as lang from '../util/lang';
import { closest } from '../util/component'

import Store from '../util/store';
import NonReactive from '../mixin/non-reactive';
import Validator from '../util/validator';

import XField from '../model/XField';

const XFormItem = {
  name: 'xform-item',
  mixins: [NonReactive],
  props: {
    field: {
      type: XField,
      default: null
    },
    /** 
     * 是否启用验证，默认值为`true`
     * 如果传入`function`，将覆盖默认`validator`
     */
    validation: {
      type: [Boolean, Function],
      default: true
    },
    /** label 宽度 */
    labelWidth: {
      type: String,
      default(){
        return Store.findConfigProp('label.width');
      }
    },
    /** label位置 */
    labelPosition: {
      type: String,
      default(){
        const params = ['left', 'right', 'top']
        const position = Store.findConfigProp('label.position');
        
        return params.indexOf(position) >= 0 ? position : params[0];
      }
    },
    behavior: {
      type: String,
      default: 'builder'
    }
  },
  static(){
    return {
      // 待验证组件的key，以此来标识组件
      key: null,
      // 待验证组件实例
      context: null,
      // xform-builder 实例
      builder: null
    }
  },
  data(){
    return {
      message: null,
      status: null
    };
  },
  computed: {
    isNeedValidation(){
      const validation = this.validation;
      return (typeof validation == 'boolean' && validation) || typeof validation == 'function';
    },
    icons(){
      return Store.findConfigProp('icons');
    }
  },
  methods: {
    getField(){
      const field = this.field || this.$static.context.field;      
      return field instanceof XField ? field : new XField(field);
    },
    getValue(){
      return this.$static.context.value;
    },
    renderErrorMessage(){
      if(null == this.message) return null;
      return <p class='xform-item-message'>{this.message}</p>;
    },
    changeMessage(message){
      this.message = lang.isEmptyStr(message) ? null : message;
    },
    validate(event){
      if(!this.isNeedValidation) return;

      const field = this.getField();
      const value = this.getValue();
      return Validator.validate(field, value, this, this.validation)
        .then(() => {
          this.message = null;
          this.status = null;

          return true;
        })
        .catch(error => {
          const message = this.parseError(error);

          this.message = message;
          this.status = 'error';

          return message;
        })
    },
    addField(event){
      if(!this.isNeedValidation) return;
      
      const {key, context} = event;
      const builder = this.$static.builder

      this.$static.key = key;
      this.$static.context = context;

      if(null != builder){
        builder.$emit('xform.builder.field.add', {key, validate: this.validate})
      }
    },
    removeField(event){
      const key = event.key;
      if(!this.isNeedValidation || key != this.$static.key) return;

      const builder = this.$static.builder;
      if(null != builder){
        builder.$emit('xform.builder.field.remove', {key})
      }

      this.$static.key = null;
      this.$static.context = null;
    },
    parseError(error){
      if(null == error) return null;
      if(error instanceof Error) return error.message;

      return error;
    },
    renderTooltip(){
      if(null == this.field || null == this.field.help || this.behavior == 'viewer') return null;

      const icon = <i class={[this.icons.builderHelp, 'xform-item-help-icon']}></i>
      if(this.behavior == 'designer') return icon;

      return (
        <el-tooltip >
          {icon}
          <pre slot="content" class="xform-item-help-content">{this.field.help}</pre>
        </el-tooltip>
      )
    }
  },
  render(){
    const field = this.getField();

    const className = {
      'xform-item': true,
      [`xform-item-${this.labelPosition}`]: true,
      'xform-is-required': field.required,
      [`xform-is-${this.status}`]: null != this.status
    }

    const labelStyle = {
      width: this.labelWidth
    };

    return (
      <div class={className} data-behavior={this.behavior}>
        <label class="xform-item-label" style={labelStyle}>
          <span>{field.title}</span>
          {this.renderTooltip()}
        </label>
        <div class="xform-item-content">
          {this.$slots.default}
          {this.renderErrorMessage()}
        </div>
      </div>
    )
  },
  created(){
    this.$static.builder = closest(this, 'xform-builder')

    if(this.isNeedValidation) {
      this.$on('xform.builder.field.add', this.addField);
      this.$on('xform.builder.field.remove', this.removeField);
      this.$on('xform.builder.validate', this.validate);
    }
  },
  destroyed(){
    if(this.isNeedValidation) {
      this.$off('xform.builder.validate', this.validate);
      this.$off('xform.builder.field.add', this.addField);
      this.$off('xform.builder.field.remove', this.removeField);
    }
  }
}

export default XFormItem;