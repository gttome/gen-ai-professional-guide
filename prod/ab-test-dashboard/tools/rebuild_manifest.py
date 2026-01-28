import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sessions_dir = ROOT / "data" / "sessions"
out_path = ROOT / "data" / "manifest.json"

sessions = sorted([p.name for p in sessions_dir.glob("*.txt")])

manifest = {
    "schemaVersion": 1,
    "description": "Book Cover Tester sessions (TXT files with embedded JSON blocks).",
    "sessions": [f"data/sessions/{fn}" for fn in sessions]
}

out_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(f"Updated manifest with {len(sessions)} sessions: {out_path}")
