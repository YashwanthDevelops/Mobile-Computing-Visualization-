import {useEffect, useState, type CSSProperties} from 'react'
import type {Lesson,Unit} from './types'
import {Icon} from './Icons'
import Diagram from './Diagram'
import {Experiment} from './Experiments'
import {useReducedMotion} from './motion'

const modeNames={map:'Network map',ladder:'Message flow',layers:'Architecture',experiment:'Experiment',compare:'Comparison',timeline:'Timeline'}
const baseNames:Record<string,string>={'mobile-generations':'Generations','mobile-security':'Secure connection','quantum-optimization':'Fast uplink','quantum-devices':'Weak field',gprs:'Upload','wap-sms':'WAP request','mobile-ip':'Mobile IPv6','bluetooth-wimax':'Radio links','softswitch-vpn':'Call control','cloud-quantum':'Available backend','client-hardware':'PDA input',h323:'Two-party call',ims:'Registration','in-ss7':'Call trace','palm-os':'Save a record',symbian:'Contacts lookup'}
function position(n:number,max:number,min=0){return Number.isFinite(n)?Math.max(min,Math.min(Math.floor(n),max)):min}
export default function TopicPlayer({lesson,unit,step,scenario}:{lesson:Lesson;unit:Unit;step:number;scenario:number}){
 const variant=position(scenario,lesson.scenarios?.length||0)
 const option=lesson.scenarios?.[variant-1]
 const steps=option?.steps||lesson.steps,index=position(step-1,steps.length-1),s=steps[index]
 const current={...lesson,nodes:option?.nodes||lesson.nodes,mode:option?.mode||lesson.mode}
 const reduced=useReducedMotion()
 const [chosen,setChosen]=useState<string|null>(null),[playing,setPlaying]=useState(true)
 const [revision,setRevision]=useState(0),[benchVersion,setBenchVersion]=useState(0)
 const inspected=current.nodes.find(n=>n.id===chosen)
 const hasTraffic=Boolean(s.links?.length)&&current.mode!=='timeline'&&current.mode!=='layers'
 const go=(i:number,v=variant)=>{const href='#/unit/'+unit.id+'/'+lesson.slug+'/'+(i+1)+(v?'?view='+v:'');location.hash=href}
 const replay=()=>{setRevision(n=>n+1);setPlaying(true)}
 const reset=()=>{go(0,0);setChosen(null);setBenchVersion(n=>n+1);replay()}
 useEffect(()=>{setChosen(null)},[variant,index])
 useEffect(()=>{const key=(e:KeyboardEvent)=>{
   if(document.querySelector('dialog[open]')||e.altKey||e.metaKey||e.ctrlKey||e.target instanceof Element&&e.target.closest('input,select,textarea,[contenteditable]'))return
   if(e.key==='ArrowRight'&&index<steps.length-1){e.preventDefault();go(index+1)}
   else if(e.key==='ArrowLeft'&&index>0){e.preventDefault();go(index-1)}
   else if(hasTraffic&&!reduced&&e.key.toLowerCase()==='r'){e.preventDefault();replay()}
   else if(hasTraffic&&!reduced&&e.key===' '&&!(e.target instanceof Element&&e.target.closest('button,a,[role="button"]'))){e.preventDefault();setPlaying(v=>!v)}
 };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[variant,index,steps,unit,lesson,hasTraffic,reduced])
 const noun=current.mode==='timeline'?'generation':'component'
 const unitHref='#/unit/'+unit.id
 const stepButtons=<div className="step-buttons">
  <button className="button" disabled={index===0} onClick={()=>go(index-1)}><Icon name="back" size={14}/> Back</button>
  {index===steps.length-1
   ? <a className="button green next" href={unitHref}>Unit topics <Icon name="arrow" size={14}/></a>
   : <button className="button green next" onClick={()=>go(index+1)}>Next: {steps[index+1].label}<Icon name="arrow" size={14}/></button>}
 </div>
 return <main className="lesson-page page-enter" id="main" style={{'--unit-color':unit.color} as CSSProperties}>
 <article className="workspace">
  <div className="lesson-head"><div className="crumb"><a className="page-back" href={unitHref} title={unit.title}><Icon name="back" size={14}/> Back to unit</a><span>Unit {unit.numeral} · Topic {unit.topics.findIndex(t=>t.slug===lesson.slug)+1} of {unit.topics.length}</span></div>
   <h1>{lesson.title}</h1><p>{lesson.question}</p><div className="pills"><span className="pill tan"><Icon name="route" size={12}/>{modeNames[current.mode]}</span><span className="pill lavender"><Icon name="list" size={12}/>{steps.length} steps</span></div>
  </div>
  <nav className="mobile-step-nav" aria-label="Lesson steps">{stepButtons}</nav>
  <section className="stage" aria-label="Interactive visualization">
   <div className="canvas-tools"><span className="stage-key"><i className={hasTraffic&&playing&&!reduced?'flowing':''}/><span key={variant+'-'+index} className="text-reveal">{s.value||s.label}</span></span><div className="playback">{hasTraffic&&!reduced&&<><button onClick={replay} title="Replay this step (R)"><Icon name="reset" size={13}/>Replay</button><button onClick={()=>setPlaying(!playing)} title="Pause or play traffic (Space)"><Icon name={playing?'pause':'play'} size={12}/>{playing?'Pause':'Play'}</button></>}<button className="reset-btn" onClick={reset} title="Reset topic and inputs" aria-label="Reset topic">Reset</button></div></div>
   {lesson.scenarios?.length?<div className="scenarios" aria-label="Choose scenario">{[baseNames[lesson.slug]||'Walkthrough',...lesson.scenarios.map(v=>v.label)].map((label,i)=><button aria-pressed={i===variant} onClick={()=>go(0,i)} key={i}>{label}</button>)}</div>:null}
   <Diagram key={variant} lesson={current} steps={steps} index={index} revision={revision} motion={!reduced} playing={playing} chosen={chosen} onNode={id=>setChosen(old=>old===id?null:id)} onStep={go}/>
   <div className="flow-legend" aria-label="Messages in order"><div key={variant+'-'+index} className="flow-items text-reveal">{s.links?.length?s.links.map(([a,b,label],i)=><span key={i} title={(current.nodes.find(n=>n.id===a)?.label||a)+' → '+(current.nodes.find(n=>n.id===b)?.label||b)}><i style={{background:['#dc9469','#87ac8b','#b39dc6','#84a9bf'][i%4]}}/>{label}</span>):<span><Icon name="pointer" size={12}/> Select a {noun} to inspect</span>}</div></div>
  </section>
  <section className="step-strip"><div className="subhead"><b>IN THIS TOPIC</b><span>Step {index+1} of {steps.length}</span></div><div className="step-track" style={{'--step-count':steps.length,'--step-position':index} as CSSProperties}><div className="step-rail" aria-hidden="true"><span/></div>{steps.map((st,i)=><button key={i} className={i===index?'current':i<index?'earlier':''} onClick={()=>go(i)} aria-current={i===index?'step':undefined} aria-label={'Step '+(i+1)+': '+st.label}><i>{i+1}</i><span>{st.label}</span></button>)}</div></section>
  <Experiment key={variant+'-'+benchVersion} slug={lesson.slug} alternative={!!variant}/>
 </article>
 <aside className="guide-rail"><section className="guide"><div className="subhead"><b>STEP {index+1} / {steps.length}</b><span className="guide-badge">{current.mode==='experiment'?'EXPERIMENT':current.mode==='timeline'?'EVOLUTION':'WALKTHROUGH'}</span></div>
  <div aria-live="polite" aria-atomic="true"><div key={variant+'-'+index} className="guide-copy text-reveal"><h2>{s.title}</h2><p>{s.body}</p><div className="key-idea"><Icon name="idea" size={18}/><div><b>KEY IDEA</b><p>{s.idea}</p></div></div></div></div>
  <div className="guide-nav">{stepButtons}<small><kbd>←</kbd> <kbd>→</kbd> step{hasTraffic&&!reduced&&<> · <kbd>R</kbd> replay</>}</small></div>
 </section><section className={'inspector '+(inspected?'inspector-open':'')} aria-live="polite"><div className="subhead"><b><Icon name="pointer" size={13}/> COMPONENT INSPECTOR</b>{inspected&&<button className="flat-btn" onClick={()=>setChosen(null)} aria-label="Close component details"><Icon name="close" size={14}/></button>}</div>{inspected?<><h3>{inspected.label}</h3><p>{inspected.detail}</p></>:<p>Select a {noun} in the diagram to inspect its role.</p>}</section></aside>
 {inspected&&<section className="mobile-inspection" aria-live="polite"><header><strong>{inspected.label}</strong><button className="flat-btn" aria-label="Dismiss component information" onClick={()=>setChosen(null)}><Icon name="close" size={16}/></button></header><p>{inspected.detail}</p></section>}
 </main>
}
