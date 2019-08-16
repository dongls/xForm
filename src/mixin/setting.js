import XField from '../model/XField';

export default {
  props: {
    field: {
      type: XField,
      default: null
    }
  },
  methods: {
    updateProp(event){
      const target = event.target;
      const tag = target.tagName.toLowerCase();

      const prop = target.dataset.prop;
      let value = target.value;

      if(tag == 'input' && target.type == 'checkbox'){
        value = target.checked;
      }
      
      this.update(prop, value);
    },
    updateAttrs(prop, value){
      if(null == this.field) return;
      const attributes = this.field.attributes;

      this.$set(attributes, prop, value);
      this.update('attributes', attributes);
    },
    update(prop, value){
      this.$emit('update', {prop, value})
    }
  }
}