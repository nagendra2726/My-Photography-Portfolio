#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Naini Stories — Setup Script
#  Double-click this file OR run:  bash setup.sh
#  It copies all images into the Website folder.
# ─────────────────────────────────────────────────────────────

BRAIN="$HOME/.gemini/antigravity/brain/8147b5fa-a3a1-46d5-b20c-8aa039012c62"
WEBSITE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""
echo "  ✦ Naini Stories — Image Setup"
echo "  ─────────────────────────────"

copy_img() {
  local SRC="$BRAIN/$1"
  local DST="$WEBSITE/$2"
  if [ -f "$SRC" ]; then
    cp "$SRC" "$DST"
    echo "  ✓  $2"
  else
    echo "  ✗  Not found: $1"
  fi
}

copy_img "naini_hero_photo_1773841743071.png"  "hero.png"
copy_img "naini_logo_icon_1773841759227.png"   "logo.png"
copy_img "naini_gallery_1_1773841782537.png"   "gallery1.png"
copy_img "naini_gallery_2_1773841800654.png"   "gallery2.png"
copy_img "naini_gallery_3_1773841817590.png"   "gallery3.png"

echo ""
echo "  ✦ All done! Opening website..."
echo ""

# Open the site in the default browser
open "$WEBSITE/index.html"
