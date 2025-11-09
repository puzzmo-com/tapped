import React, { Suspense } from "react"
import { Router, Route, Switch } from "wouter"
import ReactRelay from "react-relay"
import { HelmetProvider } from "@dr.pogodin/react-helmet"
import { WouterLoaderProvider } from "tapped/src/client"
import { createRouteElements } from "tapped/src/routing"
import { createWouterRoutes } from "./routes"

const { RelayEnvironmentProvider } = ReactRelay
type Environment = ReactRelay.Environment

interface AppProps {
  environment: Environment
  helmetContext?: any
  ssrPath?: string
  loaderData?: any
}

export const App: React.FC<AppProps> = ({ environment, helmetContext, ssrPath, loaderData }) => {
  const routes = createWouterRoutes(environment)

  return (
    <HelmetProvider context={helmetContext}>
      <RelayEnvironmentProvider environment={environment}>
        <WouterLoaderProvider loaderData={loaderData}>
          <Router ssrPath={ssrPath}>
            <div className="app">
              <nav className="nav">
                <h1>Anilist API Example</h1>
              </nav>
              <main className="main">
                <Suspense fallback={<div className="loading">Loading...</div>}>
                  <Switch>
                    {createRouteElements(routes)}
                    <Route>{() => <div className="error">404 - Page not found</div>}</Route>
                  </Switch>
                </Suspense>
              </main>
            </div>
          </Router>
        </WouterLoaderProvider>
      </RelayEnvironmentProvider>
    </HelmetProvider>
  )
}
