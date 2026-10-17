#!/usr/bin/env python3
"""Generate the palace kit with the Meshy API, spending as few credits as possible.

Flow per piece: cheap untextured preview -> look at the thumbnail -> texture only the keepers.
Nothing is ever re-generated: task ids are saved in state.json and reused.

  export MESHY_API_KEY=msy_...
  python3 tools/meshy/meshy_kit.py plan                 # cost estimate, no API calls
  python3 tools/meshy/meshy_kit.py balance
  python3 tools/meshy/meshy_kit.py preview P01 P02      # or: preview --priority 1
  python3 tools/meshy/meshy_kit.py status               # polls tasks, saves thumbnails
  python3 tools/meshy/meshy_kit.py texture P01          # refine a preview you liked
  python3 tools/meshy/meshy_kit.py download P01         # GLB into design/palace-kit/models/

Credit prices below are Meshy's published API prices as of Oct 2026; check
https://docs.meshy.ai/en/api/pricing and edit COST if they change.
"""
import json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
KIT = ROOT / "design/palace-kit/kit.json"
OUT = ROOT / "design/palace-kit"
STATE = OUT / "state.json"
API = "https://api.meshy.ai/openapi"
COST = {"preview": 20, "refine": 10}   # text-to-3d latest model: preview, then texture
BUDGET = int(os.environ.get("MESHY_BUDGET", "400"))  # hard stop for this script's spending


def call(method, path, body=None):
    key = os.environ.get("MESHY_API_KEY")
    if not key:
        sys.exit("MESHY_API_KEY is not set")
    req = urllib.request.Request(API + path, method=method,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} {path} -> {e.code} {e.read().decode()[:400]}")


def load():
    kit = json.loads(KIT.read_text())
    state = json.loads(STATE.read_text()) if STATE.exists() else {"spent": 0, "pieces": {}}
    return kit, state


def save(state):
    STATE.write_text(json.dumps(state, indent=2))


def pick(kit, args):
    gen = [p for p in kit["pieces"] if "prompt" in p]
    if "--priority" in args:
        n = int(args[args.index("--priority") + 1])
        return [p for p in gen if p["priority"] <= n]
    return [p for p in gen if p["id"] in args] if args else gen


def spend(state, amount):
    if state["spent"] + amount > BUDGET:
        sys.exit(f"stopping: would spend {state['spent'] + amount} credits, budget is {BUDGET} (set MESHY_BUDGET)")
    state["spent"] += amount


def cmd_plan(kit, state, args):
    total = 0
    for p in pick(kit, args):
        c = COST["preview"] + COST["refine"]
        total += c
        print(f"{p['id']}  P{p['priority']}  {c:>3} cr  {p['name']}  ({p['reuse']})")
    print(f"total if every preview is kept: {total} credits; owner models K00, K01: 0")


def cmd_preview(kit, state, args):
    for p in pick(kit, args):
        s = state["pieces"].setdefault(p["id"], {})
        if s.get("preview"):
            print(p["id"], "already has preview", s["preview"]); continue
        spend(state, COST["preview"])
        r = call("POST", "/v2/text-to-3d", {
            "mode": "preview",
            "prompt": (p["prompt"] + ", " + kit["style_suffix"])[:600],
            "ai_model": "latest",
            "topology": "triangle",
            "should_remesh": True,
            "target_polycount": p["target_polycount"],
            "symmetry_mode": p.get("symmetry", "auto"),
        })
        s["preview"] = r["result"]; save(state)
        print(p["id"], "preview task", s["preview"])


def cmd_texture(kit, state, args):
    for p in pick(kit, args):
        s = state["pieces"].get(p["id"], {})
        if not s.get("preview"):
            print(p["id"], "has no preview yet"); continue
        if s.get("refine"):
            print(p["id"], "already textured", s["refine"]); continue
        spend(state, COST["refine"])
        r = call("POST", "/v2/text-to-3d", {
            "mode": "refine",
            "preview_task_id": s["preview"],
            "enable_pbr": True,
            "texture_prompt": p.get("texture_prompt", kit["texture_prompt"]),
            "texture_image_url": kit["style_image"],
        })
        s["refine"] = r["result"]; save(state)
        print(p["id"], "texture task", s["refine"])


def fetch(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, dest)


def cmd_status(kit, state, args):
    for pid, s in state["pieces"].items():
        for stage in ("preview", "refine"):
            if not s.get(stage):
                continue
            t = call("GET", f"/v2/text-to-3d/{s[stage]}")
            print(f"{pid} {stage:7} {t['status']:10} {t.get('progress', 0):>3}%")
            if t["status"] == "SUCCEEDED" and t.get("thumbnail_url"):
                thumb = OUT / "thumbs" / f"{pid}-{stage}.png"
                if not thumb.exists():
                    fetch(t["thumbnail_url"], thumb)
    save(state)


def cmd_download(kit, state, args):
    for p in pick(kit, args):
        s = state["pieces"].get(p["id"], {})
        tid = s.get("refine") or s.get("preview")
        if not tid:
            continue
        t = call("GET", f"/v2/text-to-3d/{tid}")
        if t["status"] != "SUCCEEDED":
            print(p["id"], "not ready:", t["status"]); continue
        dest = OUT / "models" / f"{p['id']}.glb"
        fetch(t["model_urls"]["glb"], dest)
        print(p["id"], "->", dest.relative_to(ROOT))


def cmd_balance(kit, state, args):
    print("Meshy balance:", call("GET", "/v1/balance").get("balance"), "| spent by this script:", state["spent"])


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    kit, state = load()
    globals()["cmd_" + sys.argv[1]](kit, state, sys.argv[2:])
