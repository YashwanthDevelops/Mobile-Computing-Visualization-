declare module 'virtual:syllabus' {
  export const units:import('./types').Unit[]
  export const loaders:Record<string,()=>Promise<{default:import('./types').Lesson}>>
}
