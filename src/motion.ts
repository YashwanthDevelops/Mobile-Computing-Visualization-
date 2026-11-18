import {useSyncExternalStore} from 'react'

const preference = matchMedia('(prefers-reduced-motion: reduce)')
const requested = new URLSearchParams(location.search).get('reduce') === '1'
export const reducedMotion = () => requested || preference.matches

function syncPreference(){
  document.documentElement.dataset.motion = reducedMotion() ? 'reduced' : 'full'
}
syncPreference()
preference.addEventListener('change', syncPreference)

function subscribe(listener:()=>void){
  preference.addEventListener('change',listener)
  return ()=>preference.removeEventListener('change',listener)
}
export function useReducedMotion(){
  return useSyncExternalStore(subscribe, reducedMotion)
}
