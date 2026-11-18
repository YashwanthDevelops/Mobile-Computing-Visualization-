import { lazy, startTransition, Suspense, use, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import { units, loaders } from 'virtual:syllabus'
import { Brand, Folder, Icon } from './Icons'
import { NetworkHero, UnitPlate } from './CourseArt'
import type { Unit, Entry, Lesson } from './types'
import './style.css'
import './polish.css'

const TopicPlayer = lazy(()=>import('./Player'))
const fetched = new Map<string,Promise<{default:Lesson}>>()
const total = units.reduce((sum,u)=>sum+u.topics.length,0)
const unitURL=(u:Unit)=>'#/unit/'+u.id
const topicURL=(u:Unit,t:Entry)=>unitURL(u)+'/'+t.slug+'/1'
const lessonModes={map:'Network map',ladder:'Message flow',layers:'Architecture',experiment:'Experiment',compare:'Comparison',timeline:'Timeline'}
function Reader({entry,unit,step,scenario}:{entry:Entry;unit:Unit;step:number;scenario:number}){
  if(!fetched.has(entry.slug))fetched.set(entry.slug,loaders[entry.slug]())
  const lesson=use(fetched.get(entry.slug)!).default
  return <TopicPlayer key={lesson.slug} lesson={lesson} unit={unit} step={step} scenario={scenario}/>
}
function CourseTree({unit,entry,close}:{unit?:Unit;entry?:Entry;close?:()=>void}){
  const [expanded,setExpanded]=useState(unit?.id||'')
  useEffect(()=>setExpanded(unit?.id||''),[unit,entry])
  return <nav className="course-tree" aria-label="Course tree">
    <div className="tree-head"><b><Folder color="currentColor" size={17}/> Syllabus</b><span>{total} topics</span></div>
    <a href="#/" onClick={close} className={'overview-link '+(!unit?'chosen':'')} aria-current={!unit?'page':undefined}><Icon name="book"/> Course overview</a>
    <div className="tree-separator"/>
    {units.map(u=><div className="tree-unit" key={u.id}>
      <div className={'tree-parent '+(u===unit?'tree-active':'')}>
        <button aria-label={(expanded===u.id?'Collapse ':'Expand ')+'Unit '+u.numeral} aria-expanded={expanded===u.id} onClick={()=>setExpanded(expanded===u.id?'':u.id)}><Icon name="right" size={12}/></button>
        <a onClick={close} href={unitURL(u)} aria-current={u===unit&&!entry?'page':undefined}><Folder color={u.color} size={18}/><span>{u.numeral}. {u.short}</span></a>
      </div>
      <div className="tree-children" inert={expanded!==u.id}><div className="branch-clip"><div className="branch">{u.topics.map(t=><a onClick={close} className={entry===t?'chosen':''} href={topicURL(u,t)} aria-current={entry===t?'page':undefined} key={t.slug}><Icon name="file" size={13}/><span>{t.short}</span></a>)}</div></div></div>
    </div>)}
  </nav>
}
function Search({dismiss}:{dismiss:()=>void}){
  const ref=useRef<HTMLDialogElement>(null)
  const [query,setQuery]=useState('')
  const results=units.flatMap(u=>u.topics.map(t=>({u,t}))).filter(({u,t})=>(t.title+' '+t.short+' '+u.title).toLowerCase().includes(query.trim().toLowerCase()))
  useEffect(()=>{ref.current?.showModal()},[])
  return <dialog ref={ref} className="search-dialog" onClose={dismiss} onClick={e=>{if(e.target===ref.current)dismiss()}} aria-label="Search the syllabus">
    <div className="search-field"><Icon name="search" size={20}/><input autoFocus aria-label="Find a topic" placeholder="Find a topic or unit…" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&results.length){location.hash=topicURL(results[0].u,results[0].t);dismiss()}}}/><button className="flat-btn" onClick={dismiss} aria-label="Close search"><Icon name="close"/></button></div>
    <div className="search-results">{results.length===0?<p>No topics match “{query}”.</p>:results.map(({u,t})=><a href={topicURL(u,t)} onClick={dismiss} key={t.slug}><Folder color={u.color} size={21}/><span><small>Unit {u.numeral}</small>{t.title}</span><Icon name="arrow" size={15}/></a>)}</div>
  </dialog>
}
function Drawer({unit,entry,dismiss}:{unit?:Unit;entry?:Entry;dismiss:()=>void}){
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{ref.current?.showModal()},[])
  return <dialog aria-label="Syllabus menu" ref={ref} className="drawer" onClose={dismiss} onClick={e=>{if(e.target===ref.current)dismiss()}}><div><div className="drawer-top"><Brand/><button className="flat-btn" aria-label="Close menu" onClick={dismiss}><Icon name="close"/></button></div><CourseTree unit={unit} entry={entry} close={dismiss}/></div></dialog>
}
function IndexPage({unit}:{unit?:Unit}){
  return <main className="index-page page-enter" id="main" style={unit?{'--unit-color':unit.color} as CSSProperties:undefined}>
    <section className={'intro '+(unit?'unit-intro':'home-intro')}>
      <div className="intro-copy"><div className="crumb">
        {unit
          ? <><a className="page-back" href="#/"><Icon name="back" size={14}/> Back to course</a><span>Unit {unit.numeral}</span></>
          : <><a href="#/"><Icon name="book" size={14}/> Course</a><span>/</span>Overview</>}
      </div>
        <h1>{unit?unit.title:'Mobile Computing'}</h1>
        <p>{unit?unit.summary:'Follow signals, packets and calls through a mobile network, one step at a time.'}</p>
        <div className="pills">{!unit&&<span className="pill tan"><Icon name="layers" size={13}/> 5 units</span>}<span className="pill mint"><Icon name="file" size={13}/> {unit?unit.topics.length:total} topics</span></div>
      </div>
      {unit?<div className="unit-art" aria-hidden="true"><UnitPlate id={unit.id}/></div>:<NetworkHero/>}
    </section>
    <section className="catalog">
      <div className="catalog-head"><h2><Icon name={unit?'file':'layers'} size={17}/>{unit?'Topics in this unit':'Course units'}</h2><span>{unit?'Select a topic':'Select a unit'}</span></div>
      {unit?unit.topics.map((t,i)=><a className="catalog-row topic-row" key={t.slug} href={topicURL(unit,t)}>
        <span className="row-icon file-icon" style={{background:unit.color+'38'}}><Icon name="file" size={23}/></span><div className="row-copy"><span className="micro">TOPIC {String(i+1).padStart(2,'0')}</span><h3>{t.title}</h3><p>{t.question}</p></div><span className="row-count">{lessonModes[t.mode]}</span><span className="row-arrow"><Icon name="arrow" size={16}/></span>
      </a>):units.map(u=><a className="catalog-row unit-row" href={unitURL(u)} key={u.id} style={{'--unit-color':u.color} as CSSProperties}>
        <span className="row-icon" style={{background:u.color+'32'}}><Folder color={u.color} size={30}/></span><div className="row-copy"><span className="micro">UNIT {u.numeral}</span><h3>{u.title}</h3></div><span className="row-illustration"><UnitPlate id={u.id}/></span><span className="row-count">{u.topics.length} topics</span><span className="row-arrow"><Icon name="arrow" size={16}/></span>
      </a>)}
    </section>
  </main>
}
function App(){
  const [route,setRoute]=useState(location.hash)
  const [search,setSearch]=useState(false),[drawer,setDrawer]=useState(false)
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem('mobile-theme')==='dark'}catch{return false}})
  const [base,query='']=route.replace(/^#\/?/,'').split('?'),[prefix,uid,slug,num]=base.split('/')
  const unit=prefix==='unit'?units.find(u=>u.id===uid):undefined,entry=unit?.topics.find(t=>t.slug===slug)
  const invalid=Boolean(base&&(!unit||(slug&&!entry)))
  useEffect(()=>{const change=()=>{const next=location.hash;startTransition(()=>setRoute(next));setSearch(false);setDrawer(false)};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[])
  useEffect(()=>{window.scrollTo(0,0);document.title=(entry?.short||unit?.short||'Course overview')+' · Mobile Computing'},[entry,unit])
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';try{localStorage.setItem('mobile-theme',dark?'dark':'light')}catch{}},[dark])
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(s=>!s);setDrawer(false)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
  return <><a className="skip" href="#main" onClick={e=>{e.preventDefault();const main=document.querySelector('main');if(main){main.tabIndex=-1;main.focus()}}}>Skip to content</a>
    <header className="topbar"><button className="flat-btn mobile-menu" aria-label="Open course menu" onClick={()=>setDrawer(true)}><Icon name="menu"/></button><a href="#/" className="brand-link" aria-label="Mobile Computing home"><Brand/></a><a href="#/" className="learn-tab"><Icon name="book"/> Learn</a>
      <div className="top-actions"><button className="search-open" onClick={()=>setSearch(true)} aria-label="Search topics"><Icon name="search"/><span>Search topics…</span><kbd>Ctrl K</kbd></button><button className="theme-toggle" aria-label={dark?'Switch to light theme':'Switch to dark theme'} onClick={()=>setDark(!dark)}><Icon name={dark?'sun':'moon'}/></button></div>
    </header>
    <div className="app-body"><aside className="sidebar"><CourseTree unit={unit} entry={entry}/></aside>
      {invalid?<main id="main" className="index-page"><h1>Topic unavailable</h1><a href="#/">Return to course overview</a></main>:entry&&unit?<Suspense fallback={<main id="main" className="loading">Opening {entry.short}…</main>}><Reader entry={entry} unit={unit} step={Number(num)||1} scenario={Number(new URLSearchParams(query).get('view'))||0}/></Suspense>:<IndexPage key={unit?.id||'overview'} unit={unit}/>}
    </div>{search&&<Search dismiss={()=>setSearch(false)}/ >}{drawer&&<Drawer unit={unit} entry={entry} dismiss={()=>setDrawer(false)}/>}</>
}
function Course(){
  const [dismissed,setDismissed] = useState(false)
  return <>
    <App/>
    {!dismissed&&<aside className="desktop-notice" aria-label="Viewing tip">
      <p>Best viewed on a desktop.</p>
      <button className="flat-btn" type="button" aria-label="Dismiss viewing tip" onClick={()=>setDismissed(true)}><Icon name="close" size={16}/></button>
    </aside>}
  </>
}
createRoot(document.getElementById('root')!).render(<Course/>)
