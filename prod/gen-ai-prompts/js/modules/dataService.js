// dataService.js
// Loads JSON data files. Works on GitHub Pages and local test server.

async function loadJson(path){
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return await res.json();
}

export async function loadAppData(){
  return await loadJson('data/prompts.json');
}

export async function loadHelpResources(){
  return await loadJson('data/helpResources.json');
}
