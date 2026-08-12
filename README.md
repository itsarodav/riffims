# Riffims

Plataforma mobile-first para que artistas independientes gestionen sus lanzamientos musicales. Guía paso a paso desde la preproducción hasta el análisis post-lanzamiento. Producto en producción con usuarios reales.

[Abrir Riffims](https://riffims.netlify.app)

---

## Contexto

Los artistas independientes sin equipo ni sello enfrentan un proceso de lanzamiento fragmentado: mezcla, distribución, registro de derechos, pitching, promoción. No existe una herramienta que unifique ese flujo y lo haga accesible sin conocimiento previo de la industria. Las plataformas existentes distribuyen música, pero no guían al artista. **Riffims es el coach, no la distribuidora.**

---

## Decisiones Técnicas

| Decisión | Por qué |
|---|---|
| **Angular 21 (standalone + signals)** | App con estado complejo, múltiples roles y flujos condicionales. Signals para reactividad granular sin RxJS innecesario. Standalone components eliminan la ceremonia de NgModules. |
| **Supabase (Auth + PostgreSQL + RLS + Edge Functions + Storage)** | Backend completo sin servidor propio. Row Level Security como capa de autorización real, no middleware. Edge Functions para la integración con Gemini AI sin exponer API keys. |
| **Sistema de misiones como datos** | 10 niveles con subtareas, tips y reflexiones definidos como constantes tipadas (esto se tiene que reestructurar a nivel producto). El UI consume la estructura, no la define. Agregar o modificar un nivel es editar datos, no componentes. |
| **Onboarding condicional por rol** | Tres tipos de perfil (solista, banda, manager) con flujos de onboarding distintos. Guards encadenados (auth, onboarding pendiente, onboarding completo) controlan el acceso sin lógica duplicada. |
| **SCSS + BEM + design tokens** | Sistema de diseño propio sin dependencia de librerías de UI. Tokens como custom properties en `:root` para spacing (base 4px), tipografía y color. Componentes reutilizables propios: Button, Card, Avatar, Input, Tag, Chip. |
| **Gemini AI contextual (Riffi)** | Asistente integrado en el flujo de misiones, no chatbot aislado. Responde con contexto de industria musical. Tres modos predefinidos: tip, glosario, idea creativa. |

---

## Resultados

| | |
|---|---|
| **Features** | Misiones (10 niveles), AI assistant, cover preview con export, glosario musical, gestión multi-artista, badges |
| **Roles** | 3 tipos de usuario (solista, banda, manager) con vistas y flujos diferenciados |
| **Componentes** | Librería propia de 6 componentes base, 0 dependencias de UI externa |
| **Gamificación** | 4 badges con desbloqueo progresivo por hitos de lanzamiento |
| **Stack** | Angular 21 · TypeScript 5.9 · Supabase · GSAP · Vitest |

---

## Estructura

```
src/app/
├── core/           # Servicios singleton, guards y modelos
├── features/       # Páginas por feature (auth, home, releases, riffi, cover-preview...)
├── layout/         # App shell, navbar, sidebar, bottom nav
├── shared/         # Componentes reutilizables e iconos SVG
└── styles/         # Tokens, mixins, reset, tipografía
```

---

## Desarrollo local

```bash
git clone https://github.com/itsarodav/riffims.git
cd riffims
npm install
cp .env.example .env     # Añadir SUPABASE_URL y SUPABASE_ANON_KEY
npm start                # http://localhost:4200
```

---

Desarrollado por [arodav](https://arodav.com).
