declare var __VERSION__: string
declare var __IS_DEV__: boolean
declare var __VUE_VERSION__: string

declare module '@config'{
  interface config{
    base: string
  }

  export const doc: config
  export const example: config
}

interface Document {
  msElementsFromPoint(x: number, y: number): Element[];
}

declare module '*.vue' {
	import { ComponentOptionsMixin } from 'vue'
	const component: ComponentOptionsMixin
	export default component
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.md' {
  const src: string
  export default src
}


declare module '*.css' {
  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string }
  export default classes
}