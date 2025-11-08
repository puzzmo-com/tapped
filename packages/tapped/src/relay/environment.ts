import { Environment, FetchFunction, Network, Observable, RecordSource, Store } from "relay-runtime"

const createFetchFunction =
  (url: string, cookieHeader?: string): FetchFunction =>
  (params, variables) => {
    const headers: [string, string][] = [
      ["content-type", "application/json"],
      ["authorization", "Bearer ~"],
      ["auth-provider", "custom"],
    ]

    if (cookieHeader) headers.push(["cookie", cookieHeader])

    const response = fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    })

    return Observable.from(response.then((data) => data.json()))
  }

/**
 * Creates a Relay environment with network layer and store for GraphQL queries
 */
export const createEnvironment = (url: string, records: RecordSource, cookieHeader?: string) => {
  const network = Network.create(createFetchFunction(url, cookieHeader))
  const store = new Store(records)
  return new Environment({ store, network })
}
