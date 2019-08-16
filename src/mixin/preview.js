import XField from '../model/XField';
import {genPlaceholder} from '../util/component';

export default {
  props: {
    field: {
      type: XField,
      default: null
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
  }
}