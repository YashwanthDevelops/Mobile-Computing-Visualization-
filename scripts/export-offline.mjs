import { build } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputPath = resolve(process.argv[2] || 'mobile-computing.html')
const bundle = await build({
  logLevel: 'warn',
  build: {
    write: false,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } }
  }
})
const files = (Array.isArray(bundle) ? bundle[0] : bundle).output
const js = files.find(file => file.type === 'chunk' && file.isEntry)
const css = files.find(file => file.type === 'asset' && file.fileName.endsWith('.css'))
if (!js || !css) throw new Error('The offline export requires one script and one stylesheet.')
const dataURL = async (file, type) => 'data:'+type+';base64,'+(await readFile(file)).toString('base64')
const font = await dataURL('public/assets/mono.woff2','font/woff2')
const hero = await dataURL('public/assets/hero.webp','image/webp')
const icon = await dataURL('public/favicon.svg','image/svg+xml')
const styles = String(css.source).replace(/url\((?:["'])?[^)]*?mono\.woff2(?:["'])?\)/g, 'url("'+font+'")')
const script = js.code.replaceAll('./assets/hero.webp',hero).replaceAll('./favicon.svg',icon).replace(/<\/script/gi,'<\\/script')
const license = (await readFile('public/assets/font-license.txt','utf8')).replaceAll('--','—')
const html = (await readFile('index.html','utf8'))
  .replace('./favicon.svg',icon)
  .replace('</head>',()=>'<style>'+styles+'</style></head>')
  .replace('<script type="module" src="/src/main.tsx"></script>',()=>'<script type="module">'+script+'</script>')
await writeFile(outputPath,html+'\n<!-- Bundled font license\n'+license+'\n-->\n')
console.log('Saved '+outputPath)
