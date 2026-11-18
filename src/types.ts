export type Mode = 'map' | 'timeline' | 'layers' | 'ladder' | 'compare' | 'experiment'
export type DiagramNode = {id:string; label:string; kind:string; x:number; y:number; detail:string}
export type Step = {label:string; title:string; body:string; idea:string; active:string[]; links?:[string,string,string][]; value?:string}
export type Scenario = {label:string; description:string; steps:Step[]; nodes?:DiagramNode[]; mode?:Mode}
export type Lesson = {slug:string; title:string; short:string; question:string; mode:Mode; nodes:DiagramNode[]; steps:Step[]; scenarios?:Scenario[]}
export type Entry = Pick<Lesson,'slug'|'title'|'short'|'question'|'mode'>
export type Unit = {id:string; numeral:string; title:string; short:string; color:string; summary:string; topics:Entry[]}
