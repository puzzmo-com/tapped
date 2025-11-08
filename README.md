# Tapped

A server-side rendering (SSR) framework for React applications built on Fastify, Vite, Relay, and Wouter.

## Monorepo Structure

- `packages/tapped` - The core tapped framework
- `examples/anilist` - Example SSR app using the Anilist.co GraphQL API

## Getting Started

```bash
# Install dependencies
yarn install

# Run the Star Wars example
yarn dev

# Build all packages
yarn build

# Type check all packages
yarn type-check
```

## What is Tapped?

Tapped provides a complete infrastructure for building type-safe, server-rendered React applications with GraphQL data fetching. It combines:

- **Fastify** - Fast web server
- **Vite** - Development server and build tool
- **React** - UI framework with streaming SSR
- **Relay** - GraphQL client with data hydration
- **Wouter** - Lightweight routing

See the [tapped package README](packages/tapped/README.md) for detailed documentation.
