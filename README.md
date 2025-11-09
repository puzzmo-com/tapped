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

The goal here in open sourcing is not to give you a npm dependency but to provide a small chunk of code which you can import into your own codebase and build on top of. You're not going to want everything we want and I'm not really going to be supporting everything you want!

So, I recommend copying and pasting the folder `packages/tapped` into your repo (it is MIT licensed as referenced in the package.json) and treat it as your own code once you have it up and running.

You can use the example app in this repo to see how it all comes together (or use it as a working reference with Claude Code etc) and due to the pattern of having it only try SSR when there is a loader present on a route - you can migrate a complex client-side app to incrementally handle SSR route by route. Which is how we're migrating puzzmo.com

For the details, see the [tapped package README](packages/tapped/README.md).
