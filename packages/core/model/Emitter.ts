export class Emitter{
  private callbacks: Map<string, Set<Function>>
  constructor(){
    this.callbacks = new Map()
  }

  on(type: string, callback: Function){
    if(!this.callbacks.has(type)){
      this.callbacks.set(type, new Set)
    }

    this.callbacks.get(type).add(callback)
    return this
  }

  off(type: string, callback: Function){
    if(this.callbacks.has(type)){
      this.callbacks.get(type).delete(callback)
    }

    return this
  }

  trigger(type: string, event?: any){
    if(this.callbacks.has(type)){
      const handles = this.callbacks.get(type)

      for(const handle of handles){
        try {
          handle(event)
        } catch (error) {
          console.error(error)
        }
      }
    }

    return this
  }
}
