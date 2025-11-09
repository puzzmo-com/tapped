import { graphql, type Environment } from "react-relay"
import { preload, useGetMainPageQuery } from "tapped/src/relay"

import type { AnimeListPageQuery as AnimeListPageQueryType } from "./__generated__/AnimeListPageQuery.graphql"

const Query = graphql`
  query AnimeListPageQuery {
    Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          color
        }
        averageScore
        genres
        episodes
        status
      }
    }
  }
`

export const loadAnimeListPageQuery = (environment: Environment) => {
  return () => preload<AnimeListPageQueryType>(environment, Query)
}

export const useGetAnimeListPageQuery = () => {
  return useGetMainPageQuery<AnimeListPageQueryType>(Query, {})
}
