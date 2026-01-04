# Question Concepts Cards — Modular HTML5 App

This package is a modularized version of the original single-file HTML app.

## Project Structure

- `index.html` — App shell (no inline CSS/JS)
- `css/style.css` — Extracted styles
- `js/script.js` — App logic (loads data from `json/data.json`)
- `json/data.json` — Chapter image metadata (titles/descriptions/sections)
- `chapter1/` ... `chapter4/` — Image folders (PNG assets must live here)
- `start-server.bat` — Windows helper to run a local web server
- `infographic-gallery-user-guide.docx` — Original user guide (as provided)

## Why you need a local server

Modern browsers block `fetch()` calls from `file://` URLs for security reasons.  
Because `js/script.js` loads `json/data.json` via `fetch()`, you must run the app from `http://...`.

## Windows Setup (recommended)

1. **Install Python (if you don’t already have it)**  
   - Install Python 3.x and ensure it is on your PATH (the installer has a checkbox for this).

2. **Unzip this package** somewhere on your machine.

3. **Double-click** `start-server.bat`  
   - It starts a local web server on port **5500**.

4. Open your browser to:  
   - `http://127.0.0.1:5500/`

5. You should see the app load.  
   If you see “Could not load data.json”, the server is not running or you opened `index.html` directly.

## macOS / Linux Setup

From a terminal, in the project folder:

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Then open:

- `http://127.0.0.1:5500/`

## Adding / Updating Images

The app expects images in these folders:

- `chapter1/<imageFileName>`
- `chapter2/<imageFileName>`
- `chapter3/<imageFileName>`
- `chapter4/<imageFileName>`

The filenames must match exactly what is listed in `data.json`.

## Updating Content (json/data.json)

`json/data.json` is structured like this:

```json
{
  "chapters": {
    "1": [{ "imageFileName": "...", "title": "...", "description": "...", "section": "..." }],
    "2": [ ... ],
    "3": [ ... ],
    "4": [ ... ]
  }
}
```

To change the gallery content, edit the objects under each chapter.

## Troubleshooting

- **Blank images / broken image icon**: the PNG files are missing from the `chapterX/` folders or the filename doesn’t match `json/data.json`.
- **“Could not load data.json” toast**: you are not running a local server, or your server is running in a different folder/port.
- **Port already in use**: change `set PORT=5500` inside `start-server.bat`, and use the new port in your browser URL.

