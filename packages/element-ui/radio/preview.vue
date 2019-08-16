<script>
import {mixin} from '@src/index';

export default {
  name: 'xform-el-radio-preview',
  mixins: [mixin.preview],
  render(){
    const field = this.field;
    const layout = field.attributes.layout || 'inline';
    const options = field.options.slice(0, 3);
    const value = options.length > 0 ? options[0].value : null;

    return (
      <el-radio-group class="xform-el-radio-preview" value={value}>
        {
          options.map(option => {
            if(layout == 'button') return (
              <el-radio-button label={option.value} key={option.value}>
                {option.label || option.value}
              </el-radio-button>
            );

            const className = [];
            if(layout == 'block'){
              className.push('xform-el-radio-preview-block');
            }

            return (
              <el-radio class={className} label={option.value} key={option.value}>
                {option.label || option.value}
              </el-radio>
            )
          })
        }
      </el-radio-group>
    )
  }
}
</script>