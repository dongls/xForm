import { usePrivateProps } from '../util'
type Callbacks = Map<string, Set<Function>>

// eslint-disable-next-line no-use-before-define
const PRIV_PROPS = usePrivateProps<Emitter, { callbacks: Callbacks}>()

export class Emitter{
  constructor(){
    PRIV_PROPS.create(this, { callbacks: new Map() })
  }

  on(type: string, callback: Function){
    const callbacks = PRIV_PROPS.get<Callbacks>(this, 'callbacks')
    if(!callbacks.has(type)){
      callbacks.set(type, new Set)
    }

    callbacks.get(type).add(callback)
    return this
  }

  off(type: string, callback: Function){
    const callbacks = PRIV_PROPS.get<Callbacks>(this, 'callbacks')

    if(callbacks.has(type)){
      callbacks.get(type).delete(callback)
    }

    return this
  }

  trigger(type: string, event?: any){
    const callbacks = PRIV_PROPS.get<Callbacks>(this, 'callbacks')
    if(callbacks.has(type)){
      const handles = callbacks.get(type)

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
