import type { Environment } from "react-relay"
import ReactRelay from "react-relay"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"

import { PreloadedData } from "./types.js"

const { fetchQuery, loadQuery, useLazyLoadQuery } = ReactRelay

/**
 * Preloads a GraphQL query into the Relay environment for SSR
 */
export const preload = async <TQuery extends OperationType>(
  environment: Environment,
  graphql: GraphQLTaggedNode,
  variables: TQuery["variables"] = {},
): Promise<PreloadedData<TQuery>> => {
  await fetchQuery<TQuery>(environment, graphql, variables, {
    fetchPolicy: "store-or-network",
  }).toPromise()

  return {
    graphql,
    variables,
    query: loadQuery<TQuery>(environment, graphql, variables, {
      fetchPolicy: "store-only",
    }),
  }
}

/**
 * Hook to fetch and return GraphQL query data with lazy loading support.
 * Uses preloaded data if available (SSR), otherwise fetches lazily (CSR).
 */
export const useGetMainPageQuery = <TQuery extends OperationType>(querySDL: GraphQLTaggedNode, vars?: TQuery["variables"]) => {
  const variables = vars || ({} as TQuery["variables"])

  const result = useLazyLoadQuery<TQuery>(querySDL, variables, {
    fetchPolicy: "store-or-network",
  })

  return {
    variables,
    query: result,
  }
}
