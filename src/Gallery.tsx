import {useEffect,useRef,useState} from 'react'
import {Icon} from './Icons'

const diagrams=[
  {
    id:'gsm', title:'GSM network structure', kind:'Architecture',
    image:'./assets/gallery/gsm.png', width:710, height:702,
    description:'Start with the SIM and handset. Follow the radio link through one of the base stations to the BSC and MSC. Then locate the authentication and equipment registers beside the MSC and the PSTN connection beyond the GMSC.',
    author:'Greno', license:'Public domain', licenseURL:'https://creativecommons.org/publicdomain/mark/1.0/',
    source:'https://commons.wikimedia.org/wiki/File:Gsm_network_architecture.png',
    lesson:'#/unit/ii/gsm-architecture/1'
  },
  {
    id:'gprs', title:'GPRS core network', kind:'Interface map',
    image:'./assets/gallery/gprs.png', width:599, height:416,
    description:'Read from either radio network on the right toward the service networks on the left. Notice the Gb or IuPS access interface, Gn between packet core nodes, Gi to external networks and Gr to the subscriber database.',
    author:'Mozzerati', license:'CC BY-SA 3.0', licenseURL:'https://creativecommons.org/licenses/by-sa/3.0/',
    source:'https://commons.wikimedia.org/wiki/File:GPRS_core_structure.png',
    lesson:'#/unit/ii/gprs-architecture/1'
  }
]
const referenceDiagrams=[
  {title:'802.11 network architecture',kind:'Architecture',description:'Locate the APs, basic service sets and distribution system in a single drawing.',source:'https://commons.wikimedia.org/wiki/File:802.11_Network_Architecture.svg'},
  {title:'SIP session setup',kind:'Sequence diagram',description:'Read the request and response arrows in time order, from the invitation to the end of the call.',source:'https://commons.wikimedia.org/wiki/File:SIP_session_setup_example.svg'}
]
export default function Gallery({close,topic}:{close:()=>void;topic?:string}){
 const dialog=useRef<HTMLDialogElement>(null)
 const [index,setIndex]=useState(topic?.startsWith('gprs')?1:0)
 const item=diagrams[index]
 useEffect(()=>{dialog.current?.showModal()},[])
 return <dialog className="gallery-dialog" aria-labelledby="gallery-title" ref={dialog} onClose={close} onClick={e=>{if(e.currentTarget===e.target)close()}}>
   <header className="gallery-heading"><Icon name="grid" size={18}/><h2 id="gallery-title">Gallery</h2><button type="button" autoFocus className="flat-btn" aria-label="Close gallery" onClick={close}><Icon name="close"/></button></header>
   <div className="gallery-body">
    <div className="gallery-tabs" aria-label="Choose a diagram">
      {diagrams.map((diagram,i)=><button key={diagram.id} type="button" aria-pressed={i===index} onClick={()=>setIndex(i)}>{diagram.title}</button>)}
    </div>
    <figure key={item.id} className="gallery-item text-reveal">
      <a className="gallery-image" href={item.source} target="_blank" rel="noreferrer" title="Open source at full size">
        <img src={item.image} width={item.width} height={item.height} alt={item.title}/>
      </a>
      <figcaption>
        <div className="gallery-caption"><h3>{item.title}</h3><span>{item.kind}</span></div>
        <p>{item.description}</p>
        <div className="gallery-links"><a href={item.lesson} onClick={close}>Open interactive lesson <Icon name="arrow" size={12}/></a><span><a href={item.source} target="_blank" rel="noreferrer">{item.author} via Wikimedia Commons</a> · <a href={item.licenseURL} target="_blank" rel="noreferrer">{item.license}</a></span></div>
      </figcaption>
    </figure>
    <div className="gallery-references">
     {referenceDiagrams.map(item=><a key={item.title} href={item.source} target="_blank" rel="noreferrer"><div><strong>{item.title}</strong><span>{item.kind}</span><p>{item.description}</p></div><Icon name="arrow" size={15}/></a>)}
    </div>
   </div>
 </dialog>
}
