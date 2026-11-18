import {useEffect,useRef,useState} from 'react'
import {Icon} from './Icons'
import {examFigures} from './content/exam-figures'

type GalleryProps={slug:string;title:string;close:()=>void}
export default function Gallery({slug,title,close}:GalleryProps){
 const dialog=useRef<HTMLDialogElement>(null)
 const [index,setIndex]=useState(0)
 const figures=examFigures[slug]
 const figure=figures[index]
 const fullSize=figure.preview?.startsWith('./')?figure.preview:figure.image??figure.source
 useEffect(()=>{dialog.current?.showModal()},[])
 return <dialog className="gallery-dialog" aria-labelledby="gallery-title" ref={dialog} onClose={close} onClick={e=>{if(e.currentTarget===e.target)dialog.current?.close()}}>
   <header className="gallery-heading">
     <span className="gallery-heading-icon"><Icon name="grid" size={19}/></span>
     <div><h2 id="gallery-title">Exam diagram gallery</h2><p>{title}</p></div>
     <button type="button" autoFocus className="flat-btn" aria-label="Close gallery" onClick={()=>dialog.current?.close()}><Icon name="close"/></button>
   </header>
   <div className="gallery-body">
     {figures.length>1&&<div className="gallery-tabs" aria-label="Choose a reference figure">
       {figures.map((item,i)=><button type="button" aria-pressed={i===index} key={item.title} onClick={()=>setIndex(i)}>{item.title}</button>)}
     </div>}
     <figure key={figure.title} className="gallery-item text-reveal">
       {figure.preview&&<a className="gallery-image" href={fullSize} target="_blank" rel="noreferrer" aria-label={'Open full-size diagram: '+figure.title}>
         <img src={figure.preview} alt={figure.title}/>
       </a>}
       <figcaption>
         <div className="gallery-caption"><h3>{figure.title}</h3></div>
         <div className="gallery-draw"><h4>What to draw</h4><p>{figure.draw}</p></div>
         <div className="gallery-actions">
           <a className="button gallery-figure-action" href={fullSize} target="_blank" rel="noreferrer">Open diagram <Icon name="arrow" size={15}/></a>
           <a className="gallery-source" href={figure.source} target="_blank" rel="noreferrer">Source · {figure.publisher}</a>
         </div>
         {figure.credit&&<p className="gallery-credit">{figure.credit}{figure.license&&<> · <a href={figure.license.url} target="_blank" rel="noreferrer">{figure.license.name}</a></>}</p>}
       </figcaption>
     </figure>
   </div>
 </dialog>
}
