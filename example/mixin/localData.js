import XForm from '@src/index';
import defaultFields from '../data/fields';

const XField = XForm.model.XField;

export default {
  methods: {
    getLocalFields(){
      const key = this.fieldKey;
      const str = localStorage.getItem(key);
  
      try {
        const fields = JSON.parse(str);
        if(Array.isArray(fields) && fields.length > 0){
          return fields.map(f => f instanceof XField ? f : new XField(f))
        }
      } catch (error) {
        console.log(error)
      }
     
      return this.getDefaultFields();
    },
    getDefaultFields(){
      // 本地存储
      const key = this.fieldKey;
      const data = defaultFields.map(f => f instanceof XField ? f : new XField(f))
      this.saveFieldsToLocal(key, data)
  
      return data;
    },
    saveFieldsToLocal(key, value){
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}