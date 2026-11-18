import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import {unitsContent as contents} from './src/content/curriculum'

const descriptions = [
  ['i','I','Mobile Computing and Quantum Optimization','Mobile computing','#dfa95e','Architecture, mobile generations, security and quantum systems.'],
  ['ii','II','Wireless Technologies','Wireless technologies','#8cb699','Cellular networks, packet routing and wireless links.'],
  ['iii','III','Wireless LAN and Internetworking','Wireless LAN','#ac96ca','WLAN mobility, intelligent networks, VPNs and cloud computing.'],
  ['iv','IV','Client Programming and OS','Client programming','#db9b73','Mobile operating systems, device hardware and programming frameworks.'],
  ['v','V','Applications','Applications','#83aac4','Voice signaling, multimedia sessions and next-generation networks.']
]
const lessons = contents.flat()
const seen = new Set<string>()
for(const lesson of lessons){
  if(seen.has(lesson.slug))throw new Error('Duplicate lesson '+lesson.slug)
  seen.add(lesson.slug)
  if(!lesson.study?.sections.length||!lesson.steps.length)throw new Error('Incomplete lesson '+lesson.slug)
  for(const view of [lesson,...lesson.scenarios??[]]){
    const ids=new Set((view.nodes||lesson.nodes).map(n=>n.id))
    for(const step of view.steps){
      const used=[...step.active,...(step.links||[]).flatMap(([from,to])=>[from,to]),...Object.keys(step.positions||{})]
      if(used.some(id=>!ids.has(id)))throw new Error('Unknown diagram node in '+lesson.slug+' / '+step.label)
    }
  }
}
function curriculum():Plugin {
  return {name:'mobile-curriculum',
    resolveId(id) { if(id==='virtual:syllabus'||id.startsWith('virtual:topic/')) return '\0'+id },
    load(id) {
      if(id==='\0virtual:syllabus'){
        const units=descriptions.map(([id,numeral,title,short,color,summary],i)=>({id,numeral,title,short,color,summary,topics:contents[i].map(({slug,title,short,question,mode,study,scenarios,nodes})=>({
          slug,title,short,question,mode,keywords:[...study?.sections.map(s=>s.title)??[],...scenarios?.map(s=>s.label)??[],...nodes.map(n=>n.label)]
        }))}))
        const loaders=lessons.map(l=>JSON.stringify(l.slug)+':()=>import('+JSON.stringify('virtual:topic/'+l.slug)+')')
        return 'export const units='+JSON.stringify(units)+';export const loaders={'+loaders.join(',')+'}'
      }
      if(id.startsWith('\0virtual:topic/')){
        const lesson=lessons.find(l=>l.slug===id.slice('\0virtual:topic/'.length))
        if(!lesson)throw new Error('Unknown topic: '+id)
        return 'export default '+JSON.stringify(lesson)
      }
    }
  }
}
export default defineConfig({base:'./',plugins:[react(),curriculum()],server:{host:'127.0.0.1'}})
