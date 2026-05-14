<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# F1 2020 Web Portfolio

Interactive 3D archive of the Formula 1 2020 season. Next.js 16.2.4 App Router, React 19, Tailwind CSS v4, Three.js (WebGPU + WebGL), GSAP.

## Commands

```bash
npm run dev       # next dev
npm run build     # next build
npm run start     # next start
npm run lint      # eslint (flat config)
```

No test framework. No CI workflows.

## Architecture

- **`app/`** — App Router pages. All pages are `"use client"`. Root layout wires BootSequence → Topbar → TransitionRouter → SmoothScroll.
- **`components/`** — UI layer. `baseTeamPage.tsx` is a reusable template for all 10 team `/teams/{team}` pages. Each team has a `{team}Canvas.tsx` config that feeds `baseTeamCanvas.tsx` (3D car viewer).
- **`renders/`** — Two separate Three.js engines: `render.ts` (WebGPU via `three/webgpu` + TSL for car models) and `trackRender.ts` (WebGL + EffectComposer for SVG track maps).
- **`transition/`** — Page transitions via `next-transition-router` with F1 logo draw + wipe animation (DrawSVGPlugin).
- **`hook/`** — GSAP animation helpers (hero camera, ScrollTrigger pin, text effects).

## Key facts

- **GSAP everywhere**: ScrollTrigger, DrawSVGPlugin, SplitText, ScrambleTextPlugin. Register plugins at module level before use. Every component using GSAP needs `"use client"`.
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin with `@import "tailwindcss"` in CSS. No `tailwind.config` — custom theme via `@theme inline {}` in `globals.css`.
- **Three.js dual renderer**: Car models use WebGPU (`three/webgpu`, `three/tsl`) with Draco-compressed glTF. Tracks use WebGL (`three`) with UnrealBloomPass. Model cache (`gltfCache` Map) prevents re-downloads.
- **Team page pattern**: Every team has a data object in `components/{team}Canvas.tsx` (model config, view configs, theme), a page at `app/teams/{team}/page.tsx`, and a component entry in the root layout. To add/edit a team, touch all three.
- **All client components**: No React Server Components beyond layout metadata. Browser API usage (Three.js, GSAP) requires `"use client"`.
- **ESLint**: Flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- **Fonts**: Geist, Geist Mono, Bebas Neue (`next/font/google`), AkiraExpanded (`next/font/local` from `public/fonts/`).
- **Path alias**: `@/*` maps to project root (e.g. `@/components/Topbar`).
