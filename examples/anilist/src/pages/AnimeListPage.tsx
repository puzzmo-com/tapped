import { useGetAnimeListPageQuery } from "../queries/AnimeListPageQuery"
import { AnimeCard } from "../components/AnimeCard"

export const AnimeListPage = () => {
  const data = useGetAnimeListPageQuery()
  const animeList = data.Page?.media || []

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#ffd700", marginBottom: "2rem" }}>Top 10 Popular Anime</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {animeList.map((anime) => {
          if (!anime) return null
          return <AnimeCard key={anime.id} anime={anime} />
        })}
      </div>
    </div>
  )
}
