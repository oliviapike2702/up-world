#!/bin/bash
# Rebuild and push live to up-club.netlify.app.
# Images go into _deploy/assets/ as separate cacheable files, not inlined.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
python3 "$HERE/build-landing-page.py"
cd "$HERE"
netlify deploy --prod --dir=_deploy --message "${1:-update}"
