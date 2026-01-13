// dataService.js
// Loads data/prompts.json from the project. Works on GitHub Pages and local http.server.

export async function loadAppData(){
  const res = await fetch('data/prompts.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load prompts.json: ${res.status}`);
  return await res.json();
}
