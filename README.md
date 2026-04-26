# Riffims

A mobile-first web application for independent music artists to self-manage their releases.

## Tech stack

| Technology | Purpose |
|---|---|
| Angular 21 | Frontend framework |
| TypeScript | Language |
| SCSS + BEM | Styling methodology |
| Supabase | Backend-as-a-Service (auth, database) |
| GSAP | Animations |
| angular-svg-icon | SVG icon management |
| Netlify | Hosting & CI/CD |

## Prerequisites

- Node.js >= 18.19.1
- npm >= 10.9.4
- Angular CLI 21

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/itsarodav/riffims.git
   cd riffims
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and fill in your Supabase credentials (see the table below).

4. Start the development server:

   ```bash
   npm start
   ```

   Open [http://localhost:4200](http://localhost:4200) in your browser.

   The `prestart` hook runs `scripts/set-env.js`, which reads `.env` and
   generates `src/environments/environment.ts` and `environment.development.ts`
   automatically. Both files are gitignored.

## Environment variables

| Variable | Description | Where to find it |
|---|---|---|
| `SUPABASE_URL` | Supabase project URL | Supabase dashboard -> Project Settings -> API |
| `SUPABASE_ANON_KEY` | Supabase anonymous (public) key | Supabase dashboard -> Project Settings -> API |

> The `anon` key is public by design. Security is enforced via Row Level
> Security (RLS) policies in Supabase, not by hiding the key. Never commit the
> `service_role` key.

## Available scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `ng build` | Build for production |
| `ng test` | Run unit tests with Vitest |

## Project structure

```
src/app/
├── core/           # Singleton services and route guards
├── features/       # Feature modules (auth, home)
├── layout/         # Persistent UI elements (navbar, sidebar)
├── layouts/        # Page-level layout wrappers (auth-layout)
├── shared/         # Reusable components and SVG icons
└── styles/         # Global SCSS tokens, mixins, reset, typography and utilities
```

## Deployment

The project uses Netlify with CI/CD connected to the `main` branch. Every push
to `main` triggers an automatic build and deploy. Build configuration lives in
`netlify.toml` (build command: `npm run build`, publish dir: `dist/riffims/browser`).

Before the first deploy, set these environment variables in **Netlify -> Site
settings -> Environment variables**:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

The `prebuild` hook will pick them up and generate the Angular environment
files during each build.

Production URL: [*enlace*](https://riffims.netlify.app)

## License

Copyright &copy; 2026 Andrea Robles Dávila. All rights reserved.
