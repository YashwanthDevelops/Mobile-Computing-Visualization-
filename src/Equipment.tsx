import type { ReactNode } from 'react'

export function Equipment({kind,accent='#bfd7b6'}:{kind:string;accent?:string}){
 const paper='#f6f0e4',side='#c5bbaa',ink='#37352e',glass='#b5cad5'
 const slab=(x:number,y:number,w:number,d:number,h:number,top:string):ReactNode=><g transform={'translate('+x+' '+y+')'}><path d={`M0 0l${w} ${-w*.43} ${d} ${d*.45} ${-w} ${w*.43}z`} fill={top}/><path d={`M0 0l${d} ${d*.45}v${h}L0 ${h}z`} fill={side}/><path d={`M${d} ${d*.45}l${w} ${-w*.43}v${h}l${-w} ${w*.43}z`} fill={paper}/></g>
 let art:ReactNode
 if(['phone','tablet','app'].includes(kind)){
   art=<g transform={kind==='tablet'?'scale(1.2 0.9)':''}><path d="m-17-22 24-11 5 3v43l-25 12-4-3z" fill={side}/><path d="m-13-20 25-10v43l-25 12z" fill={paper}/><path d="m-10-15 19-8v32l-19 8z" fill={glass}/><path d="m-7-10 13-6v5l-13 6z" fill={accent} strokeWidth="1"/><path d="m-7 0 10-4m-10 9 7-3m2 16 4-2" strokeWidth="1.3"/></g>
 }else if(['tower','radio','signal'].includes(kind)){
   art=<><path d="m0-27-16 49 17-7 17 8z" fill={paper}/><path d="m0-25 1 40m-10-9 19 4-17 5m1-22 11 4-13 7M-14 20l15-16 14 17" fill="none"/><circle cy="-29" r="3.5" fill={accent}/><path d="M-8-33q-5 5 0 11m16-11q5 5 0 11m-21-16q-9 10 0 20m26-20q9 10 0 20" fill="none" stroke="#766b56"/></>
 }else if(kind==='db'){
   art=<><path d="M-18-17v34c0 11 36 11 36 0v-34" fill={accent}/><ellipse cy="-17" rx="18" ry="7" fill={paper}/><path d="M-18-5c0 9 36 9 36 0m-36 12c0 9 36 9 36 0" fill="none"/></>
 }else if(kind==='cloud'||kind==='network'){
   art=<><path d="M-20 13c-17-3-15-23-2-25 1-16 25-22 31-5 13-6 25 4 22 15-1 8-10 13-19 14z" fill={glass}/><path d="M-22 9c-10-4-10-17 1-19 3-15 22-19 27-5 13-5 22 4 18 13-2 5-6 8-12 9z" fill={paper}/></>
 }else if(kind==='laptop'){
   art=<><path d="m-24-14 34-15 3 2v28l-34 16-3-2z" fill={side}/><path d="m-20-12 30-13v23l-30 14z" fill={glass}/><path d="m-20 16 33-15 15 8-34 16-14-7z" fill={paper}/><path d="m-12 15 24-11 7 3-25 12z" fill={accent} strokeWidth="1"/></>
 }else if(kind==='chip'||kind==='sensor'){
   art=<>{slab(-23,-1,23,23,8,accent)}<path d="m-13-1 14-6 13 6-14 6z" fill={paper}/>{[-10,-3,4,11].map((v,i)=><path key={i} d={`M${v-10} ${7+i*2}l-5 3m${24+i*2} ${-10-i*2} 5 3`} fill="none"/>)}{kind==='sensor'&&<circle cy="-5" r="5" fill={glass}/>}</>
 }else if(kind==='lock'){
   art=<><path d="M-12-4v-12a12 12 0 0 1 24 0v12h-6v-12a6 6 0 0 0-12 0v12z" fill={side}/><rect x="-19" y="-6" width="38" height="28" rx="4" fill={accent}/><circle cy="5" r="3.5" fill={ink}/><path d="M0 7v6"/></>
 }else if(kind==='router'||kind==='gate'){
   art=<>{slab(-26,1,28,24,11,accent)}<path d="M-18 0v-21m36 15v-17" strokeWidth="3"/><path d="m4 16 4-2m4-2 4-2" stroke="#558063"/></>
 }else if(kind==='person'){
   art=<><circle cy="-15" r="11" fill={paper}/><path d="M-20 20v-8q0-17 20-17t20 17v8z" fill={accent}/></>
 }else{
   art=<>{[-1,-11,-21].map((y,i)=><g key={y}>{slab(-20,y,22,19,10,i===2?accent:paper)}<path d={`M4 ${y+6}l8-3`} strokeWidth="1.4"/><circle cx="16" cy={y+1} r="1.7" fill="#679974"/></g>)}</>
 }
 return <g stroke={ink} strokeWidth="1.65" strokeLinejoin="round" strokeLinecap="round">{art}</g>
}
