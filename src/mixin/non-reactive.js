export default {
  beforeCreate(){
    const fn = this.$options.static;

    if(typeof fn == 'function'){
      const data = fn.call(this);
      this.$static = Object.assign(this.$static || {}, data);
    } 
  }
}