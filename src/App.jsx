import { useEffect, useMemo, useRef, useState } from 'react';
import { searchMovies, getMovieById } from './api/omdb';
import { debounce } from './lib/debounce';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';

const PER_PAGE = 10;

export default function App() {
  const [query, setQuery] = useState('Avengers');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [theme, setTheme] = useState('light'); // ✅ Theme state

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PER_PAGE)), [total]);

  const debouncedSearch = useRef(debounce((q) => doSearch(q, 1), 500)).current;

  const doSearch = async (q, p = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await searchMovies(q, p);
      setItems(data.Search || []);
      setTotal(Number(data.totalResults || 0));
    } catch (e) {
      setItems([]);
      setTotal(0);
      setError(e?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doSearch(query, 1);
  }, []);

  useEffect(() => {
    doSearch(query, page);
  }, [page]);

  const onQueryChange = (val) => {
    setQuery(val);
    setPage(1);
    debouncedSearch(val);
  };

  const openDetails = async (id) => {
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const data = await getMovieById(id);
      setDetail(data);
    } catch (e) {
      setDetail({ Error: e?.message || 'Failed to load details' });
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedId(null);
    setDetail(null);
  };

  // ✅ Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
      
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
            🎬 Movie Finder
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gray-600 dark:text-gray-100 hover:text-indigo-500 transition"
            >
              Powered by OMDb API
            </a>
            {/* ✅ Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-indigo-200 text-white hover:bg-indigo-600 transition"
              title="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 text-white">
          <SearchBar value={query} onChange={onQueryChange} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-600 dark:text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-lg font-medium">
            No results. Try searching another title.
          </div>
        )}

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((m) => (
            <MovieCard key={m.imdbID} movie={m} onClick={() => openDetails(m.imdbID)} />
          ))}
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse aspect-[2/3] rounded-2xl bg-gray-300 dark:bg-gray-700 shadow-md"
              />
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg bg-indigo-500 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="rounded-lg bg-indigo-500 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <MovieModal
        open={!!selectedId}
        onClose={closeDetails}
        loading={detailLoading}
        data={detail}
      />

      {/* Footer */}
      <footer className="mt-12 text-center py-8 text-gray-600 dark:text-gray-400 text-sm">
        <div className="font-semibold mb-1">Made by Umair Qureshi❤️</div>
        <div>Built with ❤️ React + Vite + Tailwind · OMDb</div>
      </footer>
    </div>
  );
}
