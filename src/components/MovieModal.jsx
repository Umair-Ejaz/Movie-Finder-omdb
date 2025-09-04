import { useEffect } from 'react';

export default function MovieModal({ open, onClose, loading, data }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-soft">
        <div className="flex items-start gap-4 p-4 sm:p-6">
          {loading ? (
            <div className="w-full text-center py-10">Loading details…</div>
          ) : data?.Error ? (
            <div className="w-full text-center py-10 text-red-500">{data.Error}</div>
          ) : (
            <>
              {data?.Poster && data.Poster !== 'N/A' && (
                <img
                  src={data.Poster}
                  alt={data?.Title}
                  className="hidden sm:block w-40 h-60 object-cover rounded-xl border"
                />
              )}
              
              <div className="flex-1">
                {/* Title and close button */}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-bold">
                    {data?.Title}{' '}
                    <span className="font-normal opacity-70">
                      ({data?.Year})
                    </span>
                  </h2>
                  <button
                    onClick={onClose}
                    className="rounded-xl border px-3 py-1 text-sm"
                  >
                    Close
                  </button>
                </div>

                {/* Metadata */}
                <div className="mt-2 text-sm opacity-80">
                  {data?.Rated} · {data?.Runtime} · {data?.Genre}
                </div>

                {/* Plot */}
                <p className="mt-3 leading-relaxed">{data?.Plot}</p>

                {/* Extra Info */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <Info label="Director" value={data?.Director} />
                  <Info label="Writer" value={data?.Writer} />
                  <Info label="Actors" value={data?.Actors} />
                  <Info label="Released" value={data?.Released} />
                  <Info label="Language" value={data?.Language} />
                  <Info label="Country" value={data?.Country} />
                  <Info label="Awards" value={data?.Awards} />
                </div>

                {/* Ratings */}
                {Array.isArray(data?.Ratings) && data.Ratings.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-1">Ratings</h3>
                    <ul className="list-disc list-inside text-sm opacity-90">
                      {data.Ratings.map((r, i) => (
                        <li key={i}>{r.Source}: {r.Value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  if (!value || value === 'N/A') return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
      <div>{value}</div>
    </div>
  );
}
