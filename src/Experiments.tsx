import {useState} from 'react'
import {Icon} from './Icons'

function Circuit(){
 const [gate,setGate]=useState(false),[shots,setShots]=useState(32),[counts,setCounts]=useState<[number,number]|null>(null)
 const run=()=>{let ones=0;for(let n=0;n<shots;n++){if(gate&&Math.random()<.5)ones++}setCounts([shots-ones,ones])}
 return <div className="bench"><div className="bench-head"><strong>One-qubit simulator</strong><span>Local simulation</span></div>
 <div className="bench-inputs"><label><input type="checkbox" checked={gate} onChange={e=>{setGate(e.target.checked);setCounts(null)}}/> Apply H gate</label><label>Shots <select value={shots} onChange={e=>{setShots(+e.target.value);setCounts(null)}}>{[8,32,128,1024].map(n=><option key={n}>{n}</option>)}</select></label><button onClick={run} className="button green"><Icon name="play" size={12}/> Measure</button></div>
 <div className="circuit-line"><b>|0⟩</b><i/><span>{gate?'H':'I'}</span><i/><span>Measure</span></div>
 {counts&&<div aria-live="polite" className="counts">{counts.map((n,i)=><div key={i}><b>{i}</b><meter value={n} min={0} max={shots}/><span>{n} / {shots}</span></div>)}</div>}</div>
}
function Playout(){
 const [jitter,setJitter]=useState(60),[buffer,setBuffer]=useState(35)
 const arrivals=[.08,.6,.18,.92,.36,.7,.12,.49,.83,.32,.57,.98].map(n=>Math.round(jitter*n))
 const late=arrivals.filter(n=>n>buffer).length
 return <div className="bench"><div className="bench-head"><strong>Playout buffer</strong><span>12 simulated packets</span></div>
 <div className="sliders"><label>Delay variation <b>{jitter} ms</b><input type="range" min="0" max="120" step="5" value={jitter} onChange={e=>setJitter(+e.target.value)}/></label><label>Buffer depth <b>{buffer} ms</b><input type="range" min="0" max="150" step="5" value={buffer} onChange={e=>setBuffer(+e.target.value)}/></label></div>
 <div className="packet-bars">{arrivals.map((n,i)=><span title={'Packet '+(i+1)+': '+n+' ms extra delay'} className={n>buffer?'late':''} key={i}>{n>buffer?'×':'✓'}</span>)}</div><output>{late} late · {12-late} on time · {buffer} ms added playout delay</output></div>
}
function Placement({slow}:{slow:boolean}){
 const [edge,setEdge]=useState([false,false,false])
 const local=[2,7,3],remote=slow?[6,9,5]:[4,2,2],score=edge.reduce((sum,v,i)=>sum+(v?remote[i]:local[i]),0)
 return <div className="bench"><div className="bench-head"><strong>Try a task placement</strong><span>Illustrative cost units</span></div>
 <div className="placements">{['Resize','Infer','Archive'].map((t,i)=><button aria-pressed={edge[i]} key={t} onClick={()=>setEdge(edge.map((v,k)=>i===k?!v:v))}>{t}<b>{edge[i]?'Edge':'Local'} · {edge[i]?remote[i]:local[i]}</b></button>)}</div><output>Combined cost <b>{score}</b></output></div>
}
function Field({strong}:{strong:boolean}){
 const [field,setField]=useState(strong?80:30)
 return <div className="bench"><div className="bench-head"><strong>Sensor readout</strong><span>Idealized NV spectrum</span></div>
 <label className="field-range">Axial field <b>{field} μT</b><input type="range" min="0" max="100" value={field} onChange={e=>setField(+e.target.value)}/></label>
 <svg viewBox="0 0 500 58" className="spectrum" aria-label={'Resonance spacing '+(2*field*.028).toFixed(2)+' MHz'}><path d="M10 48h480" className="wire"/><path fill="none" stroke="var(--purple-line)" strokeWidth="2.5" d={Array.from({length:241},(_,i)=>{const x=i*2+10,d=field*1.55;const y=12+19/(1+((x-250+d)/6)**2)+19/(1+((x-250-d)/6)**2);return (i?'L':'M')+x+' '+y}).join(' ')}/></svg>
 <output>Resonance spacing <b>{(2*field*.028).toFixed(2)} MHz</b></output></div>
}
export function Experiment({slug,alternative}:{slug:string;alternative:boolean}){
 switch(slug){
 case 'quantum-frameworks':return <Circuit/>
 case 'networked-multimedia':return <Playout/>
 case 'quantum-optimization':return <Placement slow={alternative}/>
 case 'quantum-devices':return <Field strong={alternative}/>
 default:return null
 }
}
