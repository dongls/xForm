function parseMeta(article: Element){
  const meta = article.querySelector('md-meta')
  if(null == meta) return {}

  return {
    toc: meta.getAttribute('toc') !== 'false'
  }
}

function onScroll(event: Event){
  const anchors = document.querySelectorAll('.head-anchor')
  const scrollTop = document.documentElement.scrollTop + 20

  let anchor: HTMLElement = null
  for(let i = 0; i < anchors.length; i++){
    const curr = anchors[i] as HTMLElement
    const next = anchors[i + 1] as HTMLElement
    if(curr.offsetTop <= scrollTop) anchor = curr
    if(next && next.offsetTop > scrollTop) break
  }
  
  const elements = document.querySelectorAll('.article-toc > li')
  const link = anchor ? document.querySelector(`.article-toc a[href="#${anchor.id}"]`) : null
  const li = link ? link.parentNode : null

  for(const ele of elements){
    ele == li ? ele.classList.add('active') : ele.classList.remove('active')
  }
}

export function scrollTo(selector: string){
  try {
    const head = document.querySelector(decodeURIComponent(selector)) as HTMLElement
    if(null == head) return

    window.location.hash = selector
    setTimeout(() =>  document.documentElement.scrollTop = head.offsetTop - 20, 0)
  } catch (error) { /**/ }
}


function renderToc(article: Element, meta: any){
  const toc = article.parentNode.querySelector(':scope .article-toc')

  toc.innerHTML = meta.toc === false ? '' : [...article.querySelectorAll(':scope h2.head-anchor')].map(head => {
    const id = head.id
    return `<li><a href="#${id}">${id}</a></li>`
  }).join('')

  meta.toc === false ? window.removeEventListener('scroll', onScroll) : window.addEventListener('scroll', onScroll, { passive: true })
}

function enhance(path: string){
  const article = document.querySelector(`article[path="${path}"]`)
  const meta = parseMeta(article)

  renderToc(article, meta)
}

export default function(path: string){
  return new Promise(resolve => {
    setTimeout(() => {
      enhance(path)
      resolve()
    }, 0)
  })
}