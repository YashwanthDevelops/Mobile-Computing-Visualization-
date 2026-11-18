import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import one from './src/content/unit1'
import two from './src/content/unit2'
import three from './src/content/unit3'
import four from './src/content/unit4'
import five from './src/content/unit5'
import { architectureViews } from './src/content/architecture'
import type { Lesson } from './src/types'

const descriptions = [
  ['i','I','Mobile Computing and Quantum Optimization','Mobile computing','#dfa95e','Architecture, mobile generations, security and quantum systems.'],
  ['ii','II','Wireless Technologies','Wireless technologies','#8cb699','Cellular networks, packet routing and wireless links.'],
  ['iii','III','Wireless LAN and Internetworking','Wireless LAN','#ac96ca','WLAN mobility, intelligent networks, VPNs and cloud computing.'],
  ['iv','IV','Client Programming and OS','Client programming','#db9b73','Mobile operating systems, device hardware and programming frameworks.'],
  ['v','V','Applications','Applications','#83aac4','Voice signaling, multimedia sessions and next-generation networks.']
]
const contents:Lesson[][] = [one,two,three,four,five]
const lessons = contents.flat().map(lesson => {
  const extra = architectureViews[lesson.slug]
  return extra ? {...lesson, scenarios: [...(lesson.scenarios || []), extra]} : lesson
})
function curriculum():Plugin {
  return {name:'mobile-curriculum',
    resolveId(id) { if(id==='virtual:syllabus'||id.startsWith('virtual:topic/')) return '\0'+id },
    load(id) {
      if(id==='\0virtual:syllabus'){
        const units=descriptions.map(([id,numeral,title,short,color,summary],i)=>({id,numeral,title,short,color,summary,topics:contents[i].map(({slug,title,short,question,mode})=>({slug,title,short,question,mode}))}))
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
