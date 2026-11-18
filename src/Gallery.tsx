import {useEffect,useRef,useState} from 'react'
import {Icon} from './Icons'
import Diagram from './Diagram'
import type {Lesson} from './types'

type Reference = {
  title:string
  description:string
  source:string
  author:string
  license:string
  licenseURL:string
  image?:{src:string;width:number;height:number}
}
const references:Record<string,Reference> = {
  'gsm-architecture': {
    title:'GSM network structure',
    description:'Follow the radio link through the BTS and BSC to the serving MSC. Locate the subscriber and equipment registers and the external telephone network.',
    image:{src:'./assets/gallery/gsm.png',width:710,height:702},
    author:'Greno',
    license:'Public domain',
    licenseURL:'https://creativecommons.org/publicdomain/mark/1.0/',
    source:'https://commons.wikimedia.org/wiki/File:Gsm_network_architecture.png'
  },
  'gprs-architecture': {
    title:'GPRS core network',
    description:'Read from either radio network toward the service networks. Trace the Gb or IuPS access interface, Gn between core nodes, Gi to external networks, and Gr to the subscriber database.',
    image:{src:'./assets/gallery/gprs.png',width:599,height:416},
    author:'Mozzerati',
    license:'CC BY-SA 3.0',
    licenseURL:'https://creativecommons.org/licenses/by-sa/3.0/',
    source:'https://commons.wikimedia.org/wiki/File:GPRS_core_structure.png'
  },
  wlan:{
    title:'802.11 network architecture',
    description:'Locate the APs, basic service sets and distribution system in one drawing.',
    author:'Superspritz',
    license:'CC BY-SA 4.0',
    licenseURL:'https://creativecommons.org/licenses/by-sa/4.0/',
    source:'https://commons.wikimedia.org/wiki/File:802.11_Network_Architecture.svg'
  },
  sip:{
    title:'SIP session setup sequence',
    description:'Follow the message order through two SIP proxies, from the invitation to the end of the call.',
    author:'Amakuha',
    license:'CC BY-SA 4.0',
    licenseURL:'https://creativecommons.org/licenses/by-sa/4.0/',
    source:'https://commons.wikimedia.org/wiki/File:SIP_session_setup_example.svg'
  }
}

function ReferenceDiagram({reference}:{reference:Reference}){
  return <figure className="gallery-item text-reveal">
    {reference.image&&<a className="gallery-image" href={reference.source} target="_blank" rel="noreferrer" aria-label={'Open '+reference.title+' at its source'}>
      <img src={reference.image.src} width={reference.image.width} height={reference.image.height} alt={reference.title}/>
    </a>}
    <figcaption>
      <div className="gallery-caption"><h3>{reference.title}</h3></div>
      <p>{reference.description}</p>
      <div className="gallery-links">
        <a href={reference.source} target="_blank" rel="noreferrer">View on Wikimedia Commons <Icon name="arrow" size={12}/></a>
        <span>{reference.author} · <a href={reference.licenseURL} target="_blank" rel="noreferrer">{reference.license}</a></span>
      </div>
    </figcaption>
  </figure>
}

export default function Gallery({lesson,variant,index,baseLabel,close}:{lesson:Lesson;variant:number;index:number;baseLabel:string;close:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null)
  const [walkthrough,setWalkthrough]=useState(variant)
  const [frame,setFrame]=useState(index)
  const [showReference,setShowReference]=useState(false)
  const scenario=lesson.scenarios?.[walkthrough-1]
  const steps=scenario?.steps??lesson.steps
  const diagram={...lesson,nodes:scenario?.nodes??lesson.nodes,mode:scenario?.mode??lesson.mode,
    visual:scenario?.visual??(scenario?.nodes?undefined:lesson.visual)}
  const active=steps[frame]
  const reference=references[lesson.slug]
  const label=(id:string)=>diagram.nodes.find(node=>node.id===id)?.label??id
  useEffect(()=>{dialog.current?.showModal()},[])
  return <dialog className="gallery-dialog" aria-labelledby="gallery-title" ref={dialog} onClose={close} onClick={e=>{if(e.currentTarget===e.target)dialog.current?.close()}}>
    <header className="gallery-heading">
      <Icon name="grid" size={18}/>
      <div><h2 id="gallery-title">Gallery</h2><p>{lesson.title}</p></div>
      <button type="button" autoFocus className="flat-btn" aria-label="Close gallery" onClick={()=>dialog.current?.close()}><Icon name="close"/></button>
    </header>
    <div className="gallery-body">
      {reference&&<div className="gallery-tabs" aria-label="Diagram type">
        <button type="button" aria-pressed={!showReference} onClick={()=>setShowReference(false)}>Lesson diagram</button>
        <button type="button" aria-pressed={showReference} onClick={()=>setShowReference(true)}>Reference diagram</button>
      </div>}
      {showReference&&reference?<ReferenceDiagram reference={reference}/>:<>
        <div className="gallery-pickers">
          {!!lesson.scenarios?.length&&<label>Walkthrough
            <select value={walkthrough} onChange={e=>{setWalkthrough(Number(e.target.value));setFrame(0)}}>
              {[baseLabel,...lesson.scenarios.map(item=>item.label)].map((item,i)=><option key={i} value={i}>{item}</option>)}
            </select>
          </label>}
          <label>Step
            <select value={frame} onChange={e=>setFrame(Number(e.target.value))}>
              {steps.map((item,i)=><option key={i} value={i}>{i+1}. {item.label}</option>)}
            </select>
          </label>
        </div>
        <figure className="gallery-item">
          <div className="gallery-diagram" key={walkthrough+'-'+frame}>
            <Diagram lesson={diagram} steps={steps} index={frame} playing={false} motion={false} revision={0}/>
          </div>
          <figcaption className="text-reveal" key={walkthrough+'-'+frame}>
            <div className="gallery-caption"><h3>{active.title}</h3></div>
            <p>{active.body}</p>
            {!!active.links?.length&&<ol className="gallery-message-order" aria-label="Diagram message order">
              {active.links.map(([from,to,message],i)=><li key={i}><strong>{message}</strong> <span>{label(from)} → {label(to)}</span></li>)}
            </ol>}
          </figcaption>
        </figure>
      </>}
    </div>
  </dialog>
}
