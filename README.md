# Riffims

Mobile-first platform for independent music artists to self-manage their releases. Step-by-step guidance from pre-production through post-release analysis. Live product with real users.

[Open Riffims](https://riffims.netlify.app)

---

## Context

Independent artists without a team or label face a fragmented release process: mixing, distribution, rights registration, pitching, promotion. There is no tool that unifies that workflow and makes it accessible without prior industry knowledge. Existing platforms distribute music but don't guide the artist. **Riffims is the coach, not the distributor.**

---

## Technical Decisions

| Decision | Why |
|---|---|
| **Angular 21 (standalone + signals)** | App with complex state, multiple roles and conditional flows. Signals for granular reactivity without unnecessary RxJS. Standalone components remove NgModules ceremony. |
| **Supabase (Auth + PostgreSQL + RLS + Edge Functions + Storage)** | Full backend without a custom server. Row Level Security as the real authorization layer, not middleware. Edge Functions for Gemini AI integration without exposing API keys. |
| **Data-driven mission system** | 10 levels with subtasks, tips and reflections defined as typed constants (pending product-level restructuring). The UI consumes the structure, it doesn't define it. Adding or modifying a level means editing data, not components. |
| **Role-based conditional onboarding** | Three profile types (solo, band, manager) with distinct onboarding flows. Chained guards (auth, onboarding pending, onboarding complete) control access without duplicated logic. |
| **SCSS + BEM + design tokens** | Custom design system with no external UI library dependency. Tokens as `:root` custom properties for spacing (4px base), typography and color. Own reusable components: Button, Card, Avatar, Input, Tag, Chip. |
| **Contextual Gemini AI (Riffi)** | Assistant integrated into the mission flow, not an isolated chatbot. Responds with music industry context. Three predefined modes: tip, glossary, creative idea. |

---

## Results

| | |
|---|---|
| **Features** | Missions (10 levels), AI assistant, cover preview with export, music glossary, multi-artist management, badges |
| **Roles** | 3 user types (solo, band, manager) with differentiated views and flows |
| **Components** | Custom library of 6 base components, 0 external UI dependencies |
| **Gamification** | 4 badges with progressive unlocking by release milestones |
| **Stack** | Angular 21 · TypeScript 5.9 · Supabase · GSAP · Vitest |

---

## Structure

```
src/app/
├── core/           # Singleton services, guards and models
├── features/       # Pages by feature (auth, home, releases, riffi, cover-preview...)
├── layout/         # App shell, navbar, sidebar, bottom nav
├── shared/         # Reusable components and SVG icons
└── styles/         # Tokens, mixins, reset, typography
```

---

## Local Development

```bash
git clone https://github.com/itsarodav/riffims.git
cd riffims
npm install
cp .env.example .env     # Add SUPABASE_URL and SUPABASE_ANON_KEY
npm start                # http://localhost:4200
```

---

Built by [arodav](https://arodav.com).
