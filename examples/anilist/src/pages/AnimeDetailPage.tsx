import * as stylex from "@stylexjs/stylex"
import { useParams } from "wouter"
import { useGetAnimeDetailPageQuery } from "../queries/AnimeDetailPageQuery"
import { useGetRecommendedAnimeQuery } from "../queries/RecommendedAnimeQuery"
import { AnimeCard } from "../components/AnimeCard"

export const AnimeDetailPage = () => {
  const params = useParams()
  const id = parseInt(params.id || "0", 10)

  const { query: data } = useGetAnimeDetailPageQuery(id)
  const { query: recommendedData } = useGetRecommendedAnimeQuery()

  const anime = data.Media
  const recommendedAnime = recommendedData.Page?.media || []

  if (!anime) {
    return <div {...stylex.props(s.error)}>Anime not found</div>
  }

  const title = anime.title?.english || anime.title?.romaji || "Unknown Title"
  const score = anime.averageScore ? `${anime.averageScore}%` : "N/A"
  const genres = anime.genres?.filter(Boolean).join(", ") || "Unknown"
  const episodes = anime.episodes ? `${anime.episodes} episodes` : "Unknown"
  const year = anime.seasonYear ? `${anime.season || ""} ${anime.seasonYear}` : "Unknown"
  const coverColor = anime.coverImage?.color || "#2c3e50"

  // Strip HTML tags from description
  const description = anime.description?.replace(/<[^>]*>/g, "") || "No description available."

  return (
    <div {...stylex.props(s.container)}>
      <div
        {...stylex.props(s.header)}
        style={
          {
            "--cover-color": coverColor,
          } as React.CSSProperties
        }
      >
        <div {...stylex.props(s.headerContent)}>
          {anime.coverImage?.large && (
            <img {...stylex.props(s.coverImage)} src={anime.coverImage.large} alt={title} />
          )}
          <div {...stylex.props(s.info)}>
            <h1 {...stylex.props(s.title)}>{title}</h1>
            <div {...stylex.props(s.metadata)}>
              <div {...stylex.props(s.metadataItem)}>
                <span {...stylex.props(s.metadataLabel)}>Score:</span>
                <span {...stylex.props(s.score)}>{score}</span>
              </div>
              <div {...stylex.props(s.metadataItem)}>
                <span {...stylex.props(s.metadataLabel)}>Status:</span>
                <span {...stylex.props(s.metadataValue)}>{anime.status || "Unknown"}</span>
              </div>
              <div {...stylex.props(s.metadataItem)}>
                <span {...stylex.props(s.metadataLabel)}>Episodes:</span>
                <span {...stylex.props(s.metadataValue)}>{episodes}</span>
              </div>
              <div {...stylex.props(s.metadataItem)}>
                <span {...stylex.props(s.metadataLabel)}>Year:</span>
                <span {...stylex.props(s.metadataValue)}>{year}</span>
              </div>
            </div>
            <div {...stylex.props(s.genresContainer)}>
              <span {...stylex.props(s.metadataLabel)}>Genres:</span>
              <span {...stylex.props(s.genres)}>{genres}</span>
            </div>
          </div>
        </div>
      </div>

      <div {...stylex.props(s.descriptionSection)}>
        <h2 {...stylex.props(s.sectionTitle)}>Synopsis</h2>
        <p {...stylex.props(s.description)}>{description}</p>
      </div>

      <div {...stylex.props(s.recommendationsSection)}>
        <h2 {...stylex.props(s.sectionTitle)}>Recommended Anime</h2>
        <div {...stylex.props(s.recommendationsGrid)}>
          {recommendedAnime.map((recommendedItem) => {
            if (!recommendedItem || recommendedItem.id === id) return null
            return <AnimeCard key={recommendedItem.id} anime={recommendedItem} />
          })}
        </div>
      </div>
    </div>
  )
}

const s = stylex.create({
  container: {
    minHeight: "100vh",
    paddingBottom: "4rem",
  },
  header: {
    background: "linear-gradient(180deg, color-mix(in srgb, var(--cover-color) 20%, #1a1a2e) 0%, #0a0a0a 100%)",
    padding: "2rem",
    borderBottom: "2px solid color-mix(in srgb, var(--cover-color) 50%, transparent)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "2rem",
    alignItems: "flex-start",
  },
  coverImage: {
    width: "300px",
    height: "450px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#fff",
    margin: 0,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  metadata: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  metadataItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  metadataLabel: {
    color: "#888",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  metadataValue: {
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "500",
  },
  score: {
    color: "#ffd700",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  genresContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  genres: {
    color: "#fff",
    fontSize: "1rem",
  },
  descriptionSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 2rem",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#ffd700",
    marginBottom: "1.5rem",
    borderBottom: "2px solid #333",
    paddingBottom: "0.5rem",
  },
  description: {
    color: "#ccc",
    fontSize: "1.1rem",
    lineHeight: 1.8,
    margin: 0,
  },
  recommendationsSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem 3rem",
  },
  recommendationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },
  error: {
    color: "#ff4444",
    fontSize: "1.5rem",
    textAlign: "center",
    padding: "4rem",
  },
})
