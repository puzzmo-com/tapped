interface AnimeCardProps {
  anime: {
    id: number
    title?: {
      romaji?: string | null
      english?: string | null
    } | null
    coverImage?: {
      large?: string | null
      color?: string | null
    } | null
    averageScore?: number | null
    genres?: ReadonlyArray<string | null> | null
    episodes?: number | null
    status?: string | null
  }
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  const title = anime.title?.english || anime.title?.romaji || "Unknown Title"
  const score = anime.averageScore ? `${anime.averageScore}%` : "N/A"
  const genres = anime.genres?.filter(Boolean).slice(0, 3).join(", ") || "Unknown"
  const episodes = anime.episodes ? `${anime.episodes} episodes` : "Unknown"
  const coverColor = anime.coverImage?.color || "#2c3e50"

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: `0 4px 6px ${coverColor}33`,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)"
        e.currentTarget.style.boxShadow = `0 8px 12px ${coverColor}66`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = `0 4px 6px ${coverColor}33`
      }}
    >
      {anime.coverImage?.large && (
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundImage: `url(${anime.coverImage.large})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            color: "#fff",
            fontSize: "1.1rem",
            marginBottom: "0.5rem",
            minHeight: "2.5rem",
          }}
        >
          {title}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              color: "#ffd700",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {score}
          </span>
          <span
            style={{
              color: "#888",
              fontSize: "0.9rem",
              textTransform: "uppercase",
            }}
          >
            {anime.status || "Unknown"}
          </span>
        </div>
        <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          {genres}
        </p>
        <p style={{ color: "#666", fontSize: "0.85rem" }}>{episodes}</p>
      </div>
    </div>
  )
}
