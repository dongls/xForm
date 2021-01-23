function parseMeta(article: Element){
  const meta = article.querySelector('md-meta')
  if(null == meta) return {}

  return {
    toc: meta.getAttribute('toc') !== 'false'
  }
}

function getOffsetTop(element: HTMLElement): number {
  if(null == element.offsetParent) return 0
  return element.offsetTop + getOffsetTop(element.offsetParent as HTMLElement)
}

export function scrollTo(selector: string){
  try {
    const head = document.querySelector(decodeURIComponent(selector)) as HTMLElement
    if(null == head) return

    setTimeout(() => document.documentElement.scrollTop = getOffsetTop(head), 0)
  } catch (error) { /**/ }
}


function renderToc(article: Element, meta: any){
  const toc = article.parentNode.querySelector(':scope .article-toc')

  toc.innerHTML = meta.toc === false ? '' : [...article.querySelectorAll(':scope h2.head-anchor')].map(head => {
    const id = head.id
    return `<li><a href="#${id}">${id}</a></li>`
  }).join('')
}

function enhance(path: string){
  const article = document.querySelector(`article[path="${path}"]`)
  const meta = parseMeta(article)

  renderToc(article, meta)
}

export default function(path: string, hash: string){
  return new Promise(() => {
    setTimeout(() => {
      enhance(path)
      if(hash) scrollTo(hash)
    }, 0)
  })
}