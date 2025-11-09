import { graphql, type Environment } from "react-relay"
import { preload, useGetMainPageQuery } from "tapped/src/relay"

import type { AnimeDetailPageQuery as AnimeDetailPageQueryType } from "./__generated__/AnimeDetailPageQuery.graphql"

const Query = graphql`
  query AnimeDetailPageQuery($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      description
      coverImage {
        large
        color
      }
      averageScore
      genres
      episodes
      status
      season
      seasonYear
    }
  }
`

export const loadAnimeDetailPageQuery = (environment: Environment, id: number) => {
  return () => preload<AnimeDetailPageQueryType>(environment, Query, { id })
}

export const useGetAnimeDetailPageQuery = (id: number) => {
  return useGetMainPageQuery<AnimeDetailPageQueryType>(Query, { id })
}
