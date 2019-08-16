import XField from '../model/XField';
import {genPlaceholder} from '../util/component';

export default {
  props: {
    field: {
      type: XField,
      default: null,
      required: true
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  computed: {
    prettyPlaceholder(){
      if(this.placeholder) return this.placeholder;
      
      return genPlaceholder(this.field);
    }
  },
  methods: {
    input(event){
      this.$emit('input', event);
    }
  }
}