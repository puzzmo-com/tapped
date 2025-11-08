import { PreloadedQuery } from "react-relay"
import { GraphQLTaggedNode, OperationType } from "relay-runtime"

export type Params = Record<string, string | undefined>

export interface LoaderArgs {
  params: Params
  request: Request
}

export interface PreloadedData<TQuery extends OperationType> {
  graphql: GraphQLTaggedNode
  variables: TQuery["variables"]
  query: PreloadedQuery<TQuery>
}

export type LoaderFn = (args: LoaderArgs) => Promise<PreloadedData<OperationType>>
