import ReactRelay from "react-relay"
import { WouterRoute } from "tapped/src/routing"

import { AnimeListPage } from "../pages/AnimeListPage"
import { loadAnimeListPageQuery } from "../queries/AnimeListPageQuery"

type Environment = ReactRelay.Environment

export const createWouterRoutes = (environment: Environment): WouterRoute[] => [
  {
    path: "/",
    component: AnimeListPage,
    loader: loadAnimeListPageQuery(environment),
  },
]
