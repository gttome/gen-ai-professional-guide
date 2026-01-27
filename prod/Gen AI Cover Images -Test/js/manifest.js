// data/covers.json loader and minimal validation

export async function loadCoversManifest() {
  const res = await fetch("data/covers.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load covers manifest: ${res.status}`);
  const data = await res.json();

  if (!data || !Array.isArray(data.covers)) throw new Error("Manifest missing covers[]");
  if (data.covers.length !== 25) {
    // PRD assumes exactly 25 at launch. Keep behavior strict to avoid silent mistakes.
    throw new Error(`Manifest must contain exactly 25 covers. Found ${data.covers.length}.`);
  }

  for (const c of data.covers) {
    if (!c.imageId) throw new Error("Manifest cover missing imageId");
    if (!c.thumb300 || !c.thumb600 || !c.thumb1000 || !c.full) {
      throw new Error(`Manifest cover ${c.imageId} missing image paths`);
    }
  }

  return data.covers;
}
