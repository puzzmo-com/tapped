import * as stylex from "@stylexjs/stylex"
import { AnimeListPageQuery$data } from "../queries/__generated__/AnimeListPageQuery.graphql"

interface AnimeCardProps {
  anime: AnimeListPageQuery$data["Page"]["media"][0]
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  const title = anime.title?.english || anime.title?.romaji || "Unknown Title"
  const score = anime.averageScore ? `${anime.averageScore}%` : "N/A"
  const genres = anime.genres?.filter(Boolean).slice(0, 3).join(", ") || "Unknown"
  const episodes = anime.episodes ? `${anime.episodes} episodes` : "Unknown"
  const coverColor = anime.coverImage?.color || "#2c3e50"

  return (
    <div
      {...stylex.props(s.card)}
      style={
        {
          "--cover-color": coverColor,
        } as React.CSSProperties
      }
    >
      {anime.coverImage?.large && (
        <div
          {...stylex.props(s.coverImage)}
          style={
            {
              "--cover-image": `url(${anime.coverImage.large})`,
            } as React.CSSProperties
          }
        />
      )}
      <div {...stylex.props(s.content)}>
        <h3 {...stylex.props(s.title)}>{title}</h3>
        <div {...stylex.props(s.scoreStatusRow)}>
          <span {...stylex.props(s.score)}>{score}</span>
          <span {...stylex.props(s.status)}>{anime.status || "Unknown"}</span>
        </div>
        <p {...stylex.props(s.genres)}>{genres}</p>
        <p {...stylex.props(s.episodes)}>{episodes}</p>
      </div>
    </div>
  )
}

const s = stylex.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    boxShadow: "0 4px 6px color-mix(in srgb, var(--cover-color) 20%, transparent)",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 12px color-mix(in srgb, var(--cover-color) 40%, transparent)",
    },
  },
  coverImage: {
    width: "100%",
    height: "400px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "var(--cover-image)",
  },
  content: {
    padding: "1rem",
  },
  title: {
    color: "#fff",
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
    minHeight: "2.5rem",
  },
  scoreStatusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  score: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  status: {
    color: "#888",
    fontSize: "0.9rem",
    textTransform: "uppercase",
  },
  genres: {
    color: "#aaa",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  episodes: {
    color: "#666",
    fontSize: "0.85rem",
  },
})
