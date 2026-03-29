# RiffIMS

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

3. Set up environment files:

   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts 
   cp src/environments/environment.example.ts src/environments/environment.development.ts
   ```

   Open both files and replace the placeholder values with your Supabase credentials.

4. Start the development server:

   ```bash
   ng serve
   ```

   Open [http://localhost:4200](http://localhost:4200) in your browser.

## Environment variables

| Variable | Description | Where to find it |
|---|---|---|
| `supabaseUrl` | Supabase project URL | Supabase dashboard -> Project Settings -> API |
| `supabaseKey` | Supabase anonymous (public) key | Supabase dashboard -> Project Settings -> API |

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

The project uses Netlify with CI/CD connected to the `main` branch. Every push to `main` triggers an automatic build and deploy. The build output directory is `dist/riffims`.

Production URL: *aún por crear*

## License

Copyright &copy; 2026 Andrea Robles Dávila. All rights reserved.
