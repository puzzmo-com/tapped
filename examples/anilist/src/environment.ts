import { Environment, FetchFunction, Network, RecordSource, Store, Observable } from "relay-runtime"

// Helper function to convert numeric IDs to strings in the response
const convertIdsToStrings = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertIdsToStrings)
  } else if (obj !== null && typeof obj === "object") {
    const converted: any = {}
    for (const key in obj) {
      if (key === "id" && typeof obj[key] === "number") {
        converted[key] = String(obj[key])
      } else {
        converted[key] = convertIdsToStrings(obj[key])
      }
    }
    return converted
  }
  return obj
}

const createFetchFunction =
  (url: string): FetchFunction =>
  (params, variables) => {
    const response = fetch(url, {
      method: "POST",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    })

    return Observable.from(response.then((data) => data.json()).then(convertIdsToStrings))
  }

export const createEnvironment = (url: string, records: RecordSource) => {
  const network = Network.create(createFetchFunction(url))
  const store = new Store(records)
  return new Environment({ store, network })
}
