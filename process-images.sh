#!/bin/bash
set -e

IMG_DIR="public/img"
WEBP_Q=82
JPG_Q=85

# Landscape: target widths (2x desktop, 1x desktop, mobile)
L_WIDTHS=(3840 1920 828)
# Portrait: target heights (2x desktop, mobile retina, 1x desktop)
P_HEIGHTS=(2160 1600 1080)

slugify() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | \
        sed 's/[^a-z0-9]/-/g' | \
        sed 's/-\+/-/g' | \
        sed 's/^-//; s/-$//'
}

echo "=== Image Processing Script ==="
echo ""

shopt -s nullglob
sources=("${IMG_DIR}"/*.jpg "${IMG_DIR}"/*.jpeg "${IMG_DIR}"/*.png "${IMG_DIR}"/*.JPG "${IMG_DIR}"/*.JPEG "${IMG_DIR}"/*.PNG)
shopt -u nullglob

if [ ${#sources[@]} -eq 0 ]; then
    echo "No source images found in ${IMG_DIR}/"
    exit 0
fi

> "${IMG_DIR}/manifest.txt"

for src in "${sources[@]}"; do
    filename=$(basename "$src")
    base="${filename%.*}"
    slug=$(slugify "$base")

    read -r w h <<< "$(identify -format "%w %h" "${src}[0]" 2>/dev/null)"

    is_portrait=false
    [ "$h" -gt "$w" ] && is_portrait=true

    orient="landscape"
    $is_portrait && orient="portrait"

    echo "[$orient] $filename → $slug (${w}x${h})"

    generated=()

    if $is_portrait; then
        for th in "${P_HEIGHTS[@]}"; do
            if [ "$h" -le "$th" ]; then
                final_h=$h
            else
                final_h=$th
            fi
            ow=$(awk "BEGIN {printf \"%d\", $w * $final_h / $h}")

            # Skip duplicate widths
            dup=false
            for g in "${generated[@]}"; do [ "$g" = "$ow" ] && dup=true; done
            $dup && continue

            outbase="${slug}-${ow}w"
            convert "${src}[0]" -resize "x${final_h}" -quality $WEBP_Q "${IMG_DIR}/${outbase}.webp"
            convert "${src}[0]" -resize "x${final_h}" -quality $JPG_Q -sampling-factor 4:2:0 -strip -interlace Plane "${IMG_DIR}/${outbase}.jpg"
            generated+=("$ow")
            echo "  → ${outbase} (.webp + .jpg)"
        done
    else
        for tw in "${L_WIDTHS[@]}"; do
            ow=$tw
            [ "$w" -le "$tw" ] && ow=$w

            # Skip duplicate widths
            dup=false
            for g in "${generated[@]}"; do [ "$g" = "$ow" ] && dup=true; done
            $dup && continue

            outbase="${slug}-${ow}w"
            convert "${src}[0]" -resize "${ow}x" -quality $WEBP_Q "${IMG_DIR}/${outbase}.webp"
            convert "${src}[0]" -resize "${ow}x" -quality $JPG_Q -sampling-factor 4:2:0 -strip -interlace Plane "${IMG_DIR}/${outbase}.jpg"
            generated+=("$ow")
            echo "  → ${outbase} (.webp + .jpg)"
        done
    fi

    # Sort widths descending for manifest
    sorted=$(printf '%s\n' "${generated[@]}" | sort -rn | tr '\n' ' ' | sed 's/ $//')
    echo "${slug}|${orient}|${sorted}" >> "${IMG_DIR}/manifest.txt"

    rm "$src"
    echo "  ✓ Source deleted"
done

echo ""
echo "=== Manifest ==="
cat "${IMG_DIR}/manifest.txt"
echo ""
echo "Done! Processed ${#sources[@]} images."
