# Shortcut Next.js App

This repository now includes a minimal Next.js setup with standard lifecycle scripts.

## Scripts

- `npm run dev` starts the development server on `http://localhost:3000`.
- `npm run build` creates a production build.
- `npm run start` serves the production build after a successful build.
- `npm run lint` runs ESLint checks (configured via `.eslintrc.json`).

## Expected success checks

Run the following in a standard Node.js environment (Node 18.17+ recommended by Next.js 14):

1. `npm install`
2. `npm run lint`
3. `npm run build`
4. `npm run dev` (confirm server starts)
5. `npm run start` (after build, confirm production server starts)

If all commands complete successfully (or servers start without runtime errors), the project is healthy for local development and production startup.
