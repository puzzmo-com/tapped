# Tapped

A server-side rendering (SSR) framework for React applications built on Fastify, Vite, Relay, StyleX and Wouter.

## Monorepo Structure

- `packages/tapped` - The core tapped framework
- `examples/anilist` - Example SSR app using the Anilist.co GraphQL API

## Getting Started

```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Type check all packages
yarn type-check

# Run the dev server
yarn dev
```

## What is Tapped?

Tapped is a little dependency providing infrastructure for building type-safe, server-rendered React applications with GraphQL data fetching. It's based on Wouters routing system (and this demo, and puzzmo.com use StyleX)

The goal here in open sourcing is not to give you a perfect npm dependency but to provide a small chunk of code which you can import into your own codebase and build on top of. You're not going to want everything we want and I'm not really going to be supporting everything you want!

See the [tapped package README](packages/tapped/README.md) for detailed documentation.
