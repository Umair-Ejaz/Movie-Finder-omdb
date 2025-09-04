export default function SearchBar({ value, onChange, loading }) {
return (
<div className="flex items-center gap-2">
<input
value={value}
onChange={(e) => onChange(e.target.value)}
placeholder="Search movies, series..."
className="w-full rounded-2xl border bg-white/80 dark:bg-slate-900/60 px-4 py-3 shadow-soft outline-none focus:ring-2 ring-slate-300 dark:ring-slate-700"
/>
<button
onClick={() => onChange(value)}
disabled={loading}
className="rounded-2xl border px-4 py-3 text-sm disabled:opacity-50"
>{loading ? 'Searching...' : 'Search'}</button>
</div>
);
}