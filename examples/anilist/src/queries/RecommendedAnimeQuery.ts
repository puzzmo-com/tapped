import { graphql } from "react-relay"
import { useGetMainPageQuery } from "tapped/src/relay"

import type { RecommendedAnimeQuery as RecommendedAnimeQueryType } from "./__generated__/RecommendedAnimeQuery.graphql"

const Query = graphql`
  query RecommendedAnimeQuery {
    Page(page: 1, perPage: 6) {
      media(type: ANIME, sort: TRENDING_DESC) {
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

export const useGetRecommendedAnimeQuery = () => {
  return useGetMainPageQuery<RecommendedAnimeQueryType>(Query, {})
}
