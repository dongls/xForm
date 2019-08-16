import Store from '../util/store';

const XFormView = {
  name: 'xform-viewer',
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
    formatter: {
      type: Function,
      default(field, model){
        return Store.findConfigProp('viewer.formatter', 'formatter').call(this, field, model);
      }
    },
    /** label 宽度 */
    labelWidth: {
      type: String,
      default(){
        return Store.findConfigProp('viewer.label.width', 'label.width');
      }
    },
    /** label位置 */
    labelPosition: {
      type: String,
      default(){
        const params = ['left', 'right', 'top']
        const position = Store.findConfigProp('viewer.label.position', 'label.position');
        return params.indexOf(position) >= 0 ? position : params[0];
      }
    },
    mode: {
      type: String,
      default: null
    }
  },
  methods: {
    renderItem(field){
      if(field.attributes.viewer === false) return null;
      
      const content = this.createComponent(field);
      const ft = field.findFieldType();
      if(ft && ft.custom) return content;

      return (
        <xform-item 
          field={field} validation={false} behavior="viewer"
          label-position={Store.findConfigProp('viewer.label.position')} 
          label-width={Store.findConfigProp('viewer.label.width')}
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
     * 3. 检索是否有名为`${mode}_viewer`的扩展组件
     * 4. 检索默认的`viewer`组件
     * 5. 格式化的值
     * 
     * @param {XField} field -- 字段
     * @returns 组件 
     */
    createComponent(field){
      const value = this.formatter(field, this.value);
      const props = {field, value, model: this.value}

      const namedSlot = `name_${field.name}`;
      if(this.$scopedSlots[namedSlot]) {
        return this.$scopedSlots[namedSlot](props);
      }

      const typedSlot = `type_${field.type}`;
      if(this.$scopedSlots[typedSlot]) {
        return this.$scopedSlots[typedSlot](props);
      }

      const fieldType = field.findFieldType();
      if(fieldType == null){
        console.warn(`[xform]: ${field.title}(${field.type}) not implement`)
        return null;
      }

      const component = fieldType.extension[`${this.mode}_viewer`] || fieldType.component.viewer;
      if(null != component) return this.$createElement(component, {props});

      return Array.isArray(value) ? value.join(', ') : value;
    }
  },
  render(){
    return (
      <div class="xform-viewer">
        <div class="xform-viewer-main">
          {this.fields.map(this.renderItem)}
        </div>
      </div>
    )
  }
}

export default XFormView;