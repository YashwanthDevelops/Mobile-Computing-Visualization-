import {useState} from 'react'
import {Icon} from './Icons'
import {useReducedMotion} from './motion'

export function NetworkHero(){
  const reduced=useReducedMotion()
  const [run,setRun]=useState(0)
  return <div className="hero-art network-hero">
    <svg key={run} viewBox="0 0 1120 604" className="network-print" role="img" aria-label="A handset sends a signal through a radio tower to the packet core.">
      <g transform="translate(35 16)">
        <image width="1050" height="514" href="./assets/hero.webp"/>
        {!reduced&&<>
          <g className="air-waves" fill="none" stroke="#59806c" strokeLinecap="round" strokeWidth="4">
            <path d="M410 109q-22-38 4-76"/><path d="M392 118q-32-49 3-95"/>
            <path d="M629 112q22-39-3-78"/><path d="M646 120q32-50-1-94"/>
          </g>
          <g fill="#fcdfa3" stroke="#483f30" strokeWidth="3">
            <circle r="9" opacity="0"><animateMotion path="M246 426L458 426Q479 426 483 400" dur=".9s" begin=".45s" fill="freeze"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur=".9s" begin=".45s"/></circle>
            <circle r="9" opacity="0"><animateMotion path="M574 402Q580 426 603 426H781" dur=".95s" begin="1.36s" fill="freeze"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur=".95s" begin="1.36s"/></circle>
          </g>
        </>}
        {[['Handset',132],['Radio tower',526],['Packet core',897]].map(([label,x])=><g key={x} transform={'translate('+x+' 555)'}><rect x="-88" y="-19" width="176" height="39" rx="18" className="art-label"/><text textAnchor="middle" y="6" className="art-type">{label}</text></g>)}
      </g>
    </svg>
    {!reduced&&<button className="signal-replay" title="Replay signal" aria-label="Replay signal" onClick={()=>setRun(r=>r+1)}><Icon name="reset" size={14}/></button>}
  </div>
}

const ink='#544f43',paper='#fff9ea',green='#9dbc9f',purple='#b4a1c6',peach='#ddaa78',blue='#94b8c7'
function Cube({x,y,color=green,size=14}:{x:number;y:number;color?:string;size?:number}){
  return <g transform={`translate(${x} ${y}) scale(${size/14})`}><path d="m0-12 16 8-16 8-16-8z" fill={color}/><path d="m-16-4 16 8v10l-16-8z" fill={paper}/><path d="m0 4 16-8V6L0 14z" fill={color}/></g>
}
function Mast({x=70,y=42}:{x?:number;y?:number}){
  return <g transform={`translate(${x} ${y})`}><path d="m0-21-12 44 12-5 12 5z" fill={paper}/><path d="M0-21v39m-6-22 12 5-16 8m1-16 16 12M-10 17l11-7 10 11" fill="none"/><circle cy="-23" r="3" fill={peach}/><path d="M-9-27q-5 6 0 12m18-12q5 6 0 12m-24-16q-9 10 0 21m30-21q9 10 0 21" fill="none" stroke="#668b79"/></g>
}
function Layers(){
  return <g>{[20,9,-2].map((y,i)=><g key={y} transform={`translate(74 ${y+36})`}><path d="m-32 0 33-15 31 14-33 16z" fill={[peach,purple,green][i]}/><path d="m-32 0 31 15v4l-31-15z" fill={paper}/><path d="m-1 15 33-16v4L-1 19z" fill="#d8ceba"/></g>)}</g>
}
export function UnitPlate({id}:{id:string}){
 let scene
 if(id==='i')scene=<><path d="m10 47 24-10 22 10m41-13 19-8 19 8" fill="none" strokeDasharray="3 3"/><Cube x={24} y={45} color={peach} size={9}/><Layers/><Cube x={126} y={24} color={purple} size={9}/></>
 else if(id==='ii')scene=<><path d="M16 65q53-24 115-5" fill="none" strokeDasharray="3 3"/><Cube x={25} y={55} size={10} color={green}/><Mast x={77} y={43}/><path d="m113 48 12-5 4 2v19l-12 6-4-2z" fill={paper}/><path d="m117 50 8-4v13l-8 4z" fill={blue}/></>
 else if(id==='iii')scene=<><path d="m25 50 46-20 45 22-47 18zM70 30v33" fill="none" strokeDasharray="3 3"/><Cube x={71} y={24} color={purple}/><Cube x={26} y={47} size={10} color={green}/><Cube x={116} y={48} size={10} color={blue}/><Cube x={69} y={62} size={10} color={peach}/></>
 else if(id==='iv')scene=<><path d="m28 35 28-13 5 2v40L33 77l-5-3z" fill={peach}/><path d="m33 37 28-13v40L33 77z" fill={paper}/><path d="m37 40 20-9v23l-20 9z" fill={green}/><path d="m43 66 7-3m24-16 22-11" strokeDasharray="3 3"/><g transform="translate(49 0) scale(.7)"><Layers/></g></>
 else scene=<><path d="M26 22v46m97-46v46" fill="none" strokeDasharray="2 3"/><rect x="16" y="9" width="19" height="18" rx="4" fill={blue}/><rect x="113" y="9" width="19" height="18" rx="4" fill={purple}/><path d="M28 37h90l-6-3m6 3-6 3M121 50H31l7-3m-7 3 7 3M28 63h90l-6-3m6 3-6 3" fill="none"/><circle cx="63" cy="37" r="3.5" fill={peach}/><circle cx="88" cy="50" r="3.5" fill={green}/></>
 return <svg viewBox="0 0 149 86" aria-hidden="true" className="unit-plate"><g stroke={ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{scene}</g></svg>
}
