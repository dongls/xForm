<script>
import divider from './divider.vue';

export default {
  name: 'xform-el-divider-preview',
  props: {
    field: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  render(){
    const field = this.field;
    const {layout, type, top, bottom} = field.attributes;
    
    return (
      <div class="xform-template xform-el-divider-preview">
        <xform-divider title={field.title} layout={layout} type={type} top={top} bottom={bottom}/>
      </div>
    )
  },
  components: {
    [divider.name]: divider
  }
}
</script>