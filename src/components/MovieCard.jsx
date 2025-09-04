function Poster({ src, alt }) {
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
        <rect width="100%" height="100%" fill="#e2e8f0" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="16">No Image</text>
      </svg>
    `);

  return (
    <img
      src={src && src !== 'N/A' ? src : fallback}
      alt={alt || 'Movie Poster'}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

export default function MovieCard({ movie, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[2/3] overflow-hidden rounded-2xl border bg-white/60 dark:bg-slate-900/60 shadow-soft text-left"
      title={movie?.Title}
    >
      <Poster src={movie?.Poster} alt={movie?.Title} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="line-clamp-2 font-semibold group-hover:underline">{movie?.Title}</div>
        <div className="text-xs opacity-80">{movie?.Year} · {movie?.Type}</div>
      </div>
    </button>
  );
}
