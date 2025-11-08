# AniList Example - Tapped SSR

This is an example application demonstrating the Tapped SSR framework with the AniList GraphQL API.

## Features

- Server-side rendering with React streaming
- GraphQL data fetching with Relay
- File-based routing with Wouter
- Data preloading for optimal performance
- Client-side hydration

## Getting Started

```bash
# Install dependencies (from monorepo root)
yarn install

# Run the development server
yarn dev

# Or from this directory
yarn dev:serve
```

The app will be available at http://localhost:8082

## Project Structure

```
src/
  app/
    App.tsx         - Main application component
    App.css         - Global styles
    routes.ts       - Route definitions with loaders
  components/       - Reusable UI components
  pages/           - Page components
  queries/         - GraphQL queries and loaders
  environment.ts   - Relay environment setup
  tappedServerModule.tsx - Server-side rendering module
  client-entry.tsx - Client-side entry point
```

## How It Works

1. **Server Setup** (`server.mts`): Configures Fastify with Vite middleware and registers the Tapped SSR handler
2. **Routes** (`app/routes.ts`): Defines routes with data loaders that preload GraphQL data
3. **SSR Module** (`tappedServerModule.tsx`): Exports functions for creating the SSR context and rendering the app
4. **Client Entry** (`client-entry.tsx`): Hydrates the server-rendered HTML with the preloaded data

## Key Concepts

- **Shared Environment**: All loaders use the same Relay environment instance to ensure data loaded on the server is available during rendering
- **Data Preloading**: Route loaders execute before rendering to fetch data server-side
- **Hydration**: Client receives both the HTML and the serialized Relay store for instant interactivity
