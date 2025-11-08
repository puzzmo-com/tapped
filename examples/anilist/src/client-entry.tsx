import ReactDOM from "react-dom/client"
import { RecordSource } from "relay-runtime"
import { App } from "./app/App"
import { createEnvironment } from "./environment"
import "./app/App.css"

declare global {
  interface Window {
    __RECORD_SOURCE?: any
    __LOADER_DATA?: any
  }
}

const recordSource = new RecordSource(window.__RECORD_SOURCE)
const loaderData = window.__LOADER_DATA
const environment = createEnvironment("/graphql", recordSource)

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Root element not found")
}

ReactDOM.hydrateRoot(rootElement, <App environment={environment} loaderData={loaderData} />)
