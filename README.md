# Mobile Computing

A static, interactive course covering five units and 22 topics. The three screens are the syllabus, a unit index, and a topic workspace.

[Open the course on GitHub Pages](https://yashwanthdevelops.github.io/Mobile-Computing-Visualization-/)

## Run locally

Use Node.js 22.12 or later and npm. From this directory run `npm ci`, then `npm run dev`. Open the local address printed by Vite.

## Production

Run `npm run build` to check TypeScript and generate the static website in `dist/`. Run `npm run preview` to serve it locally, or upload the contents of `dist/` to a static host. Hash routes support direct links without server rewrites. Topic content loads on demand.

The GitHub Pages workflow builds and publishes the site after each push to `main`.

To create a self-contained HTML copy, run `node scripts/export-offline.mjs`. Double-click the resulting `mobile-computing.html` to open it offline.

## Edit the course

The five files in `src/content/` named `unit1.ts` through `unit5.ts` contain each topic's components, guided steps, and alternate scenarios. Additional protocol and OS views are in `src/content/architecture.ts`. Each topic can define its own layout, component roles, highlighted nodes and directional messages. The catalog and per-topic bundles are derived from this data in `vite.config.ts`.

The player supports direct step selection, arrow-key navigation, Space to pause or resume traffic, and R to replay it. Ctrl/Cmd K opens topic search. The theme preference is the only setting saved locally. Quantum and network experiments run entirely in the browser with illustrative inputs.

JetBrains Mono is bundled under the SIL Open Font License in `public/assets/font-license.txt`.
