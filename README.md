# Studioguez Temporary Slideshow

HTML/JS slideshow project using GSAP, Vite, and Tailwind CSS, served via Docker.

## Getting Started

1. `git clone https://github.com/studio-guez/website.git`
2. `cd website/`
3. `docker compose up`

## Project Structure

```
├── index.html            # Vite entry HTML
├── vite.config.js
├── package.json
├── Dockerfile            # Multi-stage build (Node → Nginx)
├── docker-compose.yml
├── public/               # Static assets (images, fonts, etc.)
└── src/
    ├── css/style.css     # Tailwind + custom styles
    └── js/app.js         # GSAP + app logic
```

## Development

`docker compose up` starts the Vite dev server with HMR on port 5174.

## Production Build

```bash
docker compose run --rm dev npm run build
```

Builds the app with Vite into the `docs/`.

The output in `docs/` is ready to deploy as-is to any static hosting.

## Access

- Dev server: http://localhost:5174
- Production: http://localhost:8080 (with `production` profile)

## Image Processing

Drop source images (`.jpg`, `.jpeg`, `.png`) into `public/img/` and run:

```bash
bash process-images.sh
```

**Requires:** ImageMagick (`convert`, `identify`)

The script will:

1. **Detect orientation** — landscape (width ≥ height) or portrait
2. **Resize** to 3 breakpoints:
   - Landscape: 3840px, 1920px, 828px wide
   - Portrait: 2160px, 1600px, 1080px tall (width computed from aspect ratio)
   - Never upscales — caps at original dimensions, deduplicates identical sizes
3. **Export** each size as both `.webp` (q82) and `.jpg` (q85, progressive, stripped metadata)
4. **Name** files in a web-friendly slug: `My Image_001 (©).jpg` → `my-image-001-{width}w.webp/.jpg`
5. **Delete** all source files
6. **Write** `public/img/manifest.txt` — pipe-delimited list of `slug|orientation|widths`

### Manifest format

```
ariana-001|portrait|1440 1066 720
ariana-002|landscape|3840 1920 828
```

Use the manifest to generate `<picture>` elements in `index.html` with `srcset` width descriptors and a `<source type="image/webp">` for modern browsers with `<img>` JPG fallback.
