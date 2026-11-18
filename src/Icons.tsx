import type { CSSProperties } from 'react'

const paths:Record<string,React.ReactNode>={
  home:<><path d="m3 10 9-7 9 7v10h-7v-6h-4v6H3z"/></>,
  book:<><path d="M3 4q5-2 9 1 4-3 9-1v15q-5-2-9 1-4-3-9-1zM12 5v15"/></>,
  search:<><circle cx="10" cy="10" r="6.3"/><path d="m15 15 5 5"/></>,
  moon:<path d="M20 15a8.8 8.8 0 0 1-11-11A9 9 0 1 0 20 15z"/>,
  sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/></>,
  arrow:<path d="M4 12h15m-6-6 6 6-6 6"/>, back:<path d="M20 12H5m6-6-6 6 6 6"/>, check:<path d="m5 12 4 4L19 6"/>,
  down:<path d="m6 9 6 6 6-6"/>, right:<path d="m9 6 6 6-6 6"/>, menu:<path d="M3 6h18M3 12h18M3 18h18"/>,
  file:<><path d="M6 3h8l4 4v14H6zM14 3v5h4"/><path d="M9 13h6m-6 3h4"/></>,
  layers:<><path d="m2 8 10-5 10 5-10 5zM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
  route:<><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h9a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h9"/></>,
  list:<><path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/></>,
  reset:<><path d="M3 8a9 9 0 1 1 0 8M3 3v6h6"/></>, play:<path d="m7 4 13 8-13 8z"/>,pause:<><path d="M7 4h3v16H7zm7 0h3v16h-3z"/></>,
  close:<path d="m6 6 12 12M18 6 6 18"/>, idea:<><path d="M10 17h4m-4 3h4M8 14a6 6 0 1 1 8 0q-2 1-2 3h-4q0-2-2-3z"/></>,
  pointer:<path d="m5 3 15 10-7 1-3 7z"/>, grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  keyboard:<><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h1m3 0h1m3 0h1m3 0h1M6 12h1m3 0h1m3 0h1M7 15h10"/></>
}
export function Icon({name,size=16,...props}:{name:string,size?:number,style?:CSSProperties,className?:string}){
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]||paths.file}</svg>
}
export function Folder({color,size=23}:{color:string,size?:number}){
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 28" strokeLinejoin="round"><path d="M2.5 6.5q0-2 2-2h7l3 3h12q2 0 2 2v13q0 2-2 2h-22q-2 0-2-2z" fill={color} stroke="#4d483e" strokeWidth="1.5"/><path d="M4 11.5h25q1.5 0 1 2l-2 10q-.2 1.5-2 1.5H4.5q-1.5 0-1.5-2l-.4-9.5q0-2 1.4-2z" fill={color} stroke="#4d483e" strokeWidth="1.5"/><path d="M5.5 14h21" stroke="#fff" strokeOpacity=".48" strokeWidth="1.4"/></svg>
}
export function Brand(){return <span className="brand"><img src="./favicon.svg" alt=""/><span>Mobile <b>Computing</b></span></span>}
