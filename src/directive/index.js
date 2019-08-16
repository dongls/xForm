import validate from './validate';

const mapper = {validate};

export default {
  bind(el, binding, vnode){
    const arg = binding.arg;
    const directive = mapper[arg];
    
    return null == directive ? null : directive.bind(el, binding, vnode)
  },
  unbind(el, binding, vnode){
    const arg = binding.arg;
    const directive = mapper[arg];
    
    return null == directive ? null : directive.unbind(el, binding, vnode)
  }
}