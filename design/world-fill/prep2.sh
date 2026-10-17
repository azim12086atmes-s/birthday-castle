#!/bin/bash
# usage: prep.sh <worker 0|1>
S=/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad; F=$S/fill; cd $F
B=https://media.githubusercontent.com/media/azim12086atmes-s/birthday-castle/main
R=https://raw.githubusercontent.com/azim12086atmes-s/birthday-castle/main
enc() { python3 -c "import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))" "$1"; }
awk -v w=$1 'NR%3==w' models_new.psv | while IFS='|' read n kind src fbx tx tris; do
  [ -f glb2/$n.json ] && continue
  if [ "$kind" = gh ]; then
    src=$F/dl/$n; mkdir -p $src
    curl -sSL --retry 3 -o $src/m.fbx "$B/$(enc "$fbx")"
    head -c 18 $src/m.fbx | grep -q "Kaydara FBX Binary" || curl -sSL --retry 3 -o $src/m.fbx "$R/$(enc "$fbx")"
    if [ -n "$tx" ]; then curl -sSL --retry 3 -o $src/m_texture.png "$R/$(enc "$tx")"; file $src/m_texture.png | grep -q PNG || curl -sSL -o $src/m_texture.png "$B/$(enc "$tx")"; fi
  fi
  timeout 900 $S/bpyenv/bin/python prep2.py -- "$src" "$n" $F/glb2 $tris > glb2/$n.log 2>&1
  grep -h 'PREP\|Error' glb2/$n.log | head -2
  [ "$kind" = gh ] && rm -rf "$F/dl/$n"
done
echo PREPDONE$1
