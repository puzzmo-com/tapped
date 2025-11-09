import { type Environment } from "react-relay"
import { WouterRoute } from "tapped/src/routing"

import { AnimeListPage } from "../pages/AnimeListPage"
import { AnimeDetailPage } from "../pages/AnimeDetailPage"
import { loadAnimeListPageQuery } from "../queries/AnimeListPageQuery"
import { loadAnimeDetailPageQuery } from "../queries/AnimeDetailPageQuery"

export const createWouterRoutes = (environment: Environment): WouterRoute[] => [
  {
    path: "/",
    component: AnimeListPage,
    loader: loadAnimeListPageQuery(environment),
  },
  {
    path: "/anime/:id",
    component: AnimeDetailPage,
    loader: ({ params }) => {
      const id = parseInt(params.id || "0", 10)
      return loadAnimeDetailPageQuery(environment, id)()
    },
  },
]
