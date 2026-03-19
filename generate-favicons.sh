#!/usr/bin/env bash
set -euo pipefail

# Generate all required favicon sizes from source PNGs
# Sources: public/favicon.png (light) and public/favicon-dark.png (dark)

cd "$(dirname "$0")"

SRC="public/favicon.png"
SRC_DARK="public/favicon-dark.png"
OUT="public"

echo "Generating favicons from $SRC and $SRC_DARK..."

# Standard favicon sizes (PNG)
for size in 16 32 48 96 128 192 512; do
    convert "$SRC" -resize "${size}x${size}" -strip "$OUT/favicon-${size}x${size}.png"
    echo "  ✓ favicon-${size}x${size}.png"
done

# Dark mode favicon sizes (PNG)
for size in 16 32 48 96 128 192 512; do
    convert "$SRC_DARK" -resize "${size}x${size}" -strip "$OUT/favicon-dark-${size}x${size}.png"
    echo "  ✓ favicon-dark-${size}x${size}.png"
done

# Apple Touch Icon (180x180)
convert "$SRC" -resize 180x180 -strip "$OUT/apple-touch-icon.png"
echo "  ✓ apple-touch-icon.png"

# Apple Touch Icon dark (180x180)
convert "$SRC_DARK" -resize 180x180 -strip "$OUT/apple-touch-icon-dark.png"
echo "  ✓ apple-touch-icon-dark.png"

# ICO file (multi-size: 16, 32, 48)
convert "$SRC" -resize 16x16 -strip "$OUT/favicon-16.tmp.png"
convert "$SRC" -resize 32x32 -strip "$OUT/favicon-32.tmp.png"
convert "$SRC" -resize 48x48 -strip "$OUT/favicon-48.tmp.png"
convert "$OUT/favicon-16.tmp.png" "$OUT/favicon-32.tmp.png" "$OUT/favicon-48.tmp.png" "$OUT/favicon.ico"
rm -f "$OUT"/favicon-*.tmp.png
echo "  ✓ favicon.ico (16, 32, 48)"

# Web app manifest icons are covered by 192 and 512 sizes above

# Generate site.webmanifest
cat > "$OUT/site.webmanifest" <<'EOF'
{
  "name": "studio guez",
  "short_name": "studio guez",
  "icons": [
    { "src": "/favicon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
EOF
echo "  ✓ site.webmanifest"

echo ""
echo "Done! All favicons generated in $OUT/"
