const BASE = 'https://www.omdbapi.com/';
const KEY = import.meta.env.VITE_OMDB_KEY;


function buildUrl(params) {
const url = new URL(BASE);
url.search = new URLSearchParams({ apikey: KEY, ...params }).toString();
return url.toString();
}


export async function searchMovies(query, page = 1) {
if (!query?.trim()) {
return { Search: [], totalResults: 0, Response: 'True' };
}
const url = buildUrl({ s: query.trim(), page });
const res = await fetch(url);
if (!res.ok) throw new Error('Network error');
const data = await res.json();
if (data.Response === 'False') {
// OMDb returns Response:false with an Error message
const err = new Error(data.Error || 'Unknown error');
err.omdb = true;
throw err;
}
return data; // { Search: [...], totalResults: 'XX' }
}


export async function getMovieById(imdbID) {
const url = buildUrl({ i: imdbID, plot: 'full' });
const res = await fetch(url);
if (!res.ok) throw new Error('Network error');
const data = await res.json();
if (data.Response === 'False') {
const err = new Error(data.Error || 'Unknown error');
err.omdb = true;
throw err;
}
return data; // full movie object
}