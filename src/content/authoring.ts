import type {DiagramNode, Link, Scenario, Step, Study} from '../types'

type NodeRow = [id:string, label:string, kind:string, x:number, y:number, detail:string]
export function nodes(rows:NodeRow[]):DiagramNode[]{
  return rows.map(([id,label,kind,x,y,detail])=>({id,label,kind,x,y,detail}))
}

export function step(label:string,title:string,body:string,idea:string,links:Link[],active?:string[]):Step {
  return {label,title,body,idea,links,active:active??[...new Set(links.flatMap(([from,to])=>[from,to]))]}
}

export function scenario(label:string,description:string,steps:Step[],options:Pick<Scenario,'nodes'|'mode'|'visual'>={}):Scenario {
  return {label,description,steps,...options}
}

export function study(overview:string,sections:[string,string][],recall:string[]):Study {
  return {overview,sections:sections.map(([title,body])=>({title,body})),recall}
}
