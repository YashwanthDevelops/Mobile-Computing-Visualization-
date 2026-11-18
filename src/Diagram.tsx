import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import type {DiagramNode,Lesson,Step} from './types'
import {Equipment} from './Equipment'

type Props={lesson:Lesson;steps:Step[];index:number;playing:boolean;motion:boolean;revision:number;chosen:string|null;onNode:(id:string)=>void;onStep:(i:number)=>void}
const accents=['#c8dcb7','#f0c88f','#cbbad9','#b7d0dc','#dfb69a','#c5d8c1','#e6c48d']
function labelLines(label:string,limit:number):string[]{
  const lines=[''];for(const word of label.split(' ')){if(lines.at(-1)!.length+word.length>limit&&lines.at(-1))lines.push(word);else lines[lines.length-1]+=(lines.at(-1)?' ':'')+word}return lines
}
function BoxLabel({label,y=28,max=21,active=false}:{label:string;y?:number;max?:number;active?:boolean}){
 const lines=labelLines(label,max),width=Math.max(...lines.map(l=>l.length))*7+16
 return <g transform={'translate(0 '+y+')'}><rect x={-width/2} y="-9" width={width} height={18+(lines.length-1)*13} rx="6" className={active?'node-label on':'node-label'}/><text textAnchor="middle" y="3" className="svg-label">{lines.map((l,i)=><tspan key={i} x="0" dy={i?13:0}>{l}</tspan>)}</text></g>
}
function Touchable({n,children,onNode,selected}:{n:DiagramNode;children:React.ReactNode;onNode:(id:string)=>void;selected:boolean}){
 return <g style={{transform:`translate(${n.x}px, ${n.y}px)`}} className={'svg-node '+(selected?'inspected':'')} role="button" tabIndex={0} aria-label={'Inspect '+n.label} aria-pressed={selected} onClick={()=>onNode(n.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();onNode(n.id)}}}><title>{n.label+' — '+n.detail}</title>{children}</g>
}
const packetColors=['#d67e49','#5a8f70','#8e73ac','#598aac']
function FlowLine({path,index,motion,total=1,playing}:{path:string;index:number;motion:boolean;total?:number;playing:boolean}){
 const duration=Math.max(2.35,0.83*total), start=index/total, end=(index+1)/total
 const times=[0,...(start>0?[start]:[]),...(end<1?[end]:[]),1]
 const points=times.map(t=>t<=start?0:1)
 const color=packetColors[index%4]
 const fade=Math.min(.055,(end-start)*.18)
 const opacityTimes=[0,...(start>0?[start]:[]),start+fade,end-fade,end,...(end<1?[1]:[])]
 const opacity=opacityTimes.map(t=>t>start&&t<end?1:0)
 return <g fill="none">
   <path d={path} stroke={color} strokeWidth="5.5" opacity=".19" strokeLinecap="round"/>
   <path d={path} stroke={color} strokeWidth="2.1" markerEnd={'url(#arrow'+index%4+')'}/>
   {motion&&<>
     <path className="edge-reveal" d={path} pathLength="100" stroke={color} strokeWidth="3.3" style={{animationPlayState:playing?'running':'paused'}}/>
     <g opacity="0">
       <circle r="9" fill={color} opacity=".24"/>
       <circle r="5.2" fill={color} stroke="#fdf6e8" strokeWidth="1.35"/>
       <animateMotion dur={duration+'s'} repeatCount="indefinite" path={path} keyTimes={times.join(';')} keyPoints={points.join(';')} calcMode="linear"/>
       <animate attributeName="opacity" dur={duration+'s'} repeatCount="indefinite" values={opacity.join(';')} keyTimes={opacityTimes.join(';')}/>
     </g>
   </>}
 </g>
}
function trimmedPath(a:DiagramNode,b:DiagramNode,offset=0){
 const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length
 const startX=a.x+ux*25-uy*offset,startY=a.y+uy*25+ux*offset,endX=b.x-ux*31-uy*offset,endY=b.y-uy*31+ux*offset
 return `M${startX} ${startY}L${endX} ${endY}`
}
export default function Diagram({lesson,steps,index,playing,motion,revision,chosen,onNode,onStep}:Props){
 const wrap=useRef<HTMLDivElement>(null),svg=useRef<SVGSVGElement>(null)
 const [small,setSmall]=useState(false)
 useEffect(()=>{if(!wrap.current)return;const watch=new ResizeObserver(([e])=>setSmall(e.contentRect.width<475));watch.observe(wrap.current);return()=>watch.disconnect()},[])
 useLayoutEffect(()=>{svg.current?.setCurrentTime(0)},[index,revision,small,motion])
 useLayoutEffect(()=>{if(playing&&motion)svg.current?.unpauseAnimations();else svg.current?.pauseAnimations()},[playing,motion])
 const step=steps[index],links=step.links||[],nodes=lesson.nodes,mode=lesson.mode
 const w=small?360:680
 const h=mode==='layers'?Math.max(325,nodes.length*43+46):mode==='timeline'?(small?nodes.length*67+25:330):mode==='ladder'?320:small?Math.ceil(nodes.length/2)*100+36:330
 const positions=nodes.map((n,i)=>{
   if(mode==='ladder')return {...n,x:50+i*(w-100)/Math.max(1,nodes.length-1),y:44}
   if(mode==='timeline')return {...n,x:small?66:62+i*(w-124)/Math.max(1,nodes.length-1),y:small?42+i*66:154}
   if(mode==='layers')return {...n,x:w/2,y:35+i*44}
   if(small){
     const moving=(lesson.slug==='wlan'&&n.id==='sta'&&index>=4)||(lesson.slug==='mobile-ip'&&n.id==='ms'&&index>0)
     return {...n,x:(nodes.length%2===1&&i===nodes.length-1?w/2:(i%2?257:99))+(moving?23:0),y:50+Math.floor(i/2)*100}
   }
   if(lesson.slug==='mobile-ip'&&n.id==='ms')return {...n,x:index===0?448:563,y:index===0?79:201}
   if(lesson.slug==='wlan'&&n.id==='sta')return {...n,x:91,y:index<4?100:222}
   return n
 })
 const byId=new Map(positions.map(n=>[n.id,n]))
 const routes=new Map<string,[string,string]>()
 steps.forEach(s=>s.links?.forEach(([a,b])=>{if(a!==b)routes.set([a,b].sort().join(':'),[a,b])}))
 const pick=(n:DiagramNode)=>{if(mode==='timeline'){const j=steps.findIndex(s=>s.active.includes(n.id));if(j>=0)onStep(j)}onNode(n.id)}
 const touch=(n:DiagramNode,children:React.ReactNode)=><Touchable key={n.id} n={n} onNode={()=>pick(n)} selected={chosen===n.id}>{children}</Touchable>
 const active=(n:DiagramNode)=>step.active.includes(n.id)||chosen===n.id
 const isMap=!['timeline','ladder','layers'].includes(mode)
 const graph=<>
 {mode==='compare'&&!small&&lesson.slug==='bluetooth-wimax'&&<><rect x="13" y="36" width="312" height="230" rx="16" className="zone"/><rect x="348" y="36" width="320" height="230" rx="16" className="zone"/></>}
 {lesson.slug==='wlan'&&!small&&positions.filter(n=>n.id==='a'||n.id==='b').map(n=><ellipse key={n.id} cx={n.x} cy={n.y} rx="118" ry="65" className="coverage"/>)}
 {[...routes.values()].map(([a,b])=>byId.has(a)&&byId.has(b)?<path key={a+b} d={trimmedPath(byId.get(a)!,byId.get(b)!)} className="wire"/>:null)}
 <g key={index+'-'+revision}>{links.map(([a,b,msg],i)=>byId.has(a)&&byId.has(b)&&a!==b?<g key={i}><title>{msg}</title><FlowLine path={trimmedPath(byId.get(a)!,byId.get(b)!,links.some(([c,d])=>a===d&&b===c)?6:0)} index={i} total={links.length} motion={motion} playing={playing}/></g>:null)}</g>
 {positions.map((n,i)=>touch(n,<><ellipse cy="23" rx="33" ry="9" className="equipment-shadow"/><ellipse cy="19" rx="31" ry="9" className={active(n)?'platform active':'platform'}/><g className={active(n)?'equipment active':'equipment'}><Equipment kind={n.kind} accent={accents[i%7]}/></g><BoxLabel label={n.label} y={36} active={active(n)} max={small?17:20}/></>))}
 </>
 const timeline=mode==='timeline'&&<><path className="wire timeline-wire" d={small?`M66 40V${h-51}`:`M62 154H${w-62}`}/>{positions.map((n,i)=>touch(n,<><circle r="23" className={active(n)?'platform active':'platform'}/><text className="generation" textAnchor="middle" y="6">{n.label}</text>{small?<text x="43" y="4" className="era-label">{steps[i]?.value||steps[i]?.label}</text>:<BoxLabel label={steps[i]?.value||steps[i]?.label||n.label} y={i%2?-51:48} max={15} active={active(n)}/>}</>))}</>
 const layers=mode==='layers'&&positions.map((n,i)=>touch(n,<><path d={`M${-w*.35} -12l16 -8h${w*.66}l-16 8z`} fill={accents[i%7]} stroke="var(--ink)"/><rect x={-w*.35} y="-12" width={w*.66} height="29" rx="3" className={active(n)?'layer on':'layer'}/><text textAnchor="middle" y="8" className="svg-label">{n.label}</text></>))
 const ladder=mode==='ladder'&&<>
 {positions.map((n,i)=><g key={n.id}><path d={`M${n.x} 85V${h-16}`} className="wire"/>{touch(n,<><g transform="scale(.73)"><Equipment kind={n.kind} accent={accents[i%7]}/></g><BoxLabel label={n.label} y={27} active={active(n)} max={small?10:16}/></>)}</g>)}
 <g key={index+'-'+revision}>{links.map(([a,b,msg],i)=>{const na=byId.get(a),nb=byId.get(b);if(!na||!nb)return null;const y=120+(i+0.5)*(h-148)/Math.max(links.length,2),sign=na.x<nb.x?1:-1;return <g key={i}><FlowLine path={`M${na.x+5*sign} ${y}H${nb.x-6*sign}`} index={i} total={links.length} motion={motion} playing={playing}/><text x={(na.x+nb.x)/2} y={y-9} textAnchor="middle" className="message-label">{msg}</text></g>})}</g>
 </>
 return <div ref={wrap} className={'diagram-area '+(mode==='ladder'||mode==='layers'?'flat-grid':'iso-grid')}><svg ref={svg} viewBox={`0 0 ${w} ${h}`} className="diagram-svg" aria-label={lesson.short+' interactive diagram'} role="group">
 <defs>{packetColors.map((c,i)=><marker key={c} id={'arrow'+i} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="3.5" markerHeight="3.5" orient="auto-start-reverse"><path d="M0 0l8 4-8 4z" fill={c}/></marker>)}</defs>
 {isMap&&graph}{timeline}{layers}{ladder}
 </svg></div>
}
