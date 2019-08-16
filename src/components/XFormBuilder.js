import NonReactive from '../mixin/non-reactive';
import Store from '../util/store';
import {isEmptyStr} from '../util/lang';

const XFormBuilder = {
  name: 'xform-builder',
  mixins: [NonReactive],
  props: {
    fields: {
      type: Array,
      default(){
        return [];
      }
    },
    value: {
      type: Object,
      default(){
        return {}
      }
    },
    mode: {
      type: String,
      default: null
    },
    tag: {
      type: String,
      default: 'form'
    }
  },
  static(){
    return {
      validators: {}
    }
  },
  data(){
    return {
      pending: false
    }
  },
  methods: {
    validate(){
      if(this.pending) return Promise.reject('[xform error]: validate pending...');

      this.pending = true;
      const validators = this.$static.validators;
      const promises = Object.keys(validators).map(key => validators[key]());

      return Promise.all(promises)
        .then(function(messages){
          return {messages, status: messages.every(m => m === true)}
        })
        .catch(err => {
          console.error('[xform error]: ', err)
        })
        .finally(() => {
          this.pending = false
        })
    },
    addField(event){
      const {key, validate} = event;
      this.$static.validators[key] = validate;
    },
    removeField(event){
      const {key} = event;
      delete this.$static.validators[key];
    },
    fillDefaultValue(value, fields){
      if(null == value) return {};
      
      fields.forEach(field => {
        let prop = field.name;
        let propValue = value[prop];

        // 因涉及单选、多选类型转换，在此处理
        if(field.type == 'select'){
          if(field.attributes.multiple !== true && Array.isArray(propValue)){
            propValue = propValue[0];
          } 

          if(field.attributes.multiple == true && !Array.isArray(propValue) && propValue != null){
            propValue = [propValue];
          } 
        }

        // 默认值
        if(propValue == null && !isEmptyStr(field.defaultValue)){
          propValue = field.defaultValue;
        }

        value[prop] = propValue;
      })

      return value;
    },
    renderFormItem(field){
      const content = this.createComponent(field);
      const ft = field.findFieldType();
      
      if(ft && ft.custom) return content;

      return (
        <xform-item 
          field={field} key={field.name}
          label-position={Store.findConfigProp('builder.label.position')} 
          label-width={Store.findConfigProp('builder.label.width')}
        >
          {content}
        </xform-item>
      )
    },
    /**
     * 根据字段对象创建对应的组件
     * 
     * 组件按以下顺序匹配，如有任一情况匹配，则创建对应组件：
     * 1. 检索是否有名为`name_${field.name}`的作用域插槽
     * 2. 检索是否有名为`type_{field.type}`的作用域插槽
     * 3. 检索是否有名为`${mode}_builder`的扩展组件
     * 4. 检索默认的`builder`组件
     * 
     * @param {XField} field -- 字段
     * @returns 组件 
     */
    createComponent(field){
      const namedSlot = `name_${field.name}`;
      if(this.$scopedSlots[namedSlot]) {
        return this.$scopedSlots[namedSlot]({field});
      }

      const typedSlot = `type_${field.type}`;
      if(this.$scopedSlots[typedSlot]) {
        return this.$scopedSlots[typedSlot]({field});
      }

      const fieldType = field.findFieldType();
      if(fieldType == null){
        return console.warn(`[xform]: ${field.title}(${field.type}) not implement`)
      }
      
      const props = {field, value: this.value[field.name]};
      const on = {
        input: val => {
          this.$set(this.value, field.name, val);
          this.$emit('input', this.value);
        }
      }
      
      const component = fieldType.extension[`${this.mode}_builder`] || fieldType.component.builder;
      return null == component ? null : this.$createElement(component, {props, on});
    },
    buildBuilderData(tag){
      let className = 'xform-builder';
      let on = null;

      if(tag == 'form'){
        on = {
          submit: event => {
            event.preventDefault();
            
            this.validate().then(result => {
              if(result.status) {
                this.$emit('submit')
              }
            })
          }
        }
      }
      
      return {'class': className, on};
    }
  },
  render(h){
    const tag = (this.tag || 'form').toLowerCase();
    const data = this.buildBuilderData(tag);
    const main = (
      <div class="xform-builder-main">
        {this.$slots.top}
        {this.fields.map(this.renderFormItem)}
        {this.$slots.bottom}
      </div>
    );
   
    return h(tag, data, [main]);
  },
  created(){
    // 补全默认值
    const value = this.fillDefaultValue(this.value, this.fields);
    this.$emit('input', value)

    this.$on('xform.builder.field.add', this.addField);
    this.$on('xform.builder.field.remove', this.removeField);
  },
  destroyed(){
    this.$off('xform.builder.field.add', this.addField);
    this.$off('xform.builder.field.remove', this.removeField);
  }
}

export default XFormBuilder;