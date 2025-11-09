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
 * Data will be read from the Relay store if it was preloaded via SSR loader.
 */
export const useGetMainPageQuery = <TQuery extends OperationType>(
  querySDL: GraphQLTaggedNode,
  vars?: TQuery["variables"],
) => {
  const variables = vars || ({} as TQuery["variables"])

  // Use store-or-network policy to read from the Relay store if data was preloaded
  const result = useLazyLoadQuery<TQuery>(querySDL, variables, {
    fetchPolicy: "store-or-network",
  })

  return {
    variables,
    query: result,
  }
}
