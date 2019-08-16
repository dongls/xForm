<script>
import {mixin} from '@src/index';

export default {
  name: 'xform-el-checkbox',
  mixins: [mixin.builder],
  props: {
    value: {
      type: Array,
      default(){
        return []
      }
    }
  },
  computed: {
    layout(){
      const field = this.field;
      return field.attributes.layout || 'inline';
    }
  },
  methods: {
    renderOption(option){
      if(this.layout == 'button') return <el-checkbox-button label={option.value} key={option.value}>{option.label || option.value}</el-checkbox-button>;

      const className = [];
      if(this.layout == 'block'){
        className.push('xform-el-checkbox-block');
      }

      return <el-checkbox class={className} label={option.value} key={option.value}>{option.label || option.value}</el-checkbox>
    }
  },
  render(){
    const options = this.field.options || [];
    const data = {
      'class': 'xform-el-checkbox',
      directives: [{
        name: 'xform',
        arg: 'validate',
        value: this.field.name
      }],
      on: {input: this.input},
      props: {value: this.value}
    }
    
    return (
      <el-checkbox-group {...data}>
        {options.map(this.renderOption)}
      </el-checkbox-group>
    )
  }
}
</script>