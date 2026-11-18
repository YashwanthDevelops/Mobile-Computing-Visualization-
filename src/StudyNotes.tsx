import type {Study} from './types'
import {Icon} from './Icons'
import {useReducedMotion} from './motion'

export default function StudyNotes({notes}:{notes:Study}){
  const reduced=useReducedMotion()
  const jump=(i:number)=>document.getElementById('study-'+i)?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})
  return <section id="study-notes" className="study-notes" aria-labelledby="study-title">
    <header className="study-heading"><Icon name="book" size={18}/><h2 id="study-title">Study notes</h2></header>
    <p className="study-overview">{notes.overview}</p>
    <nav className="study-index" aria-label="Study note sections">
      {notes.sections.map(({title},i)=><button key={i} onClick={()=>jump(i)}>{title.trim()}</button>)}
      <button onClick={()=>jump(notes.sections.length)}>Revision checklist</button>
    </nav>
    {notes.sections.map(({title,body},i)=><section className="study-section" key={i} id={'study-'+i}><h3>{title.trim()}</h3><p>{body}</p></section>)}
    <section className="study-recall" id={'study-'+notes.sections.length}>
      <h3>Revision checklist</h3>
      <ul>{notes.recall.map(item=><li key={item}>{item}</li>)}</ul>
    </section>
  </section>
}
