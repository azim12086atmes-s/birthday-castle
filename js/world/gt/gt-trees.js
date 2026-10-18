// Bundled from the owner's Golden Thread repo (azim12086atmes-s/Golden-Thread, branch 3d-builds, src/world: kit, trees, species, foliage, wind) with esbuild. Do not edit by hand: rebuild from that source.

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/kit.ts
import * as THREE7 from "three";

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/rocks.ts
import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
function hash3(x, y, z, seed) {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.3) * 43758.5453;
  return v - Math.floor(v);
}
function noise3(x, y, z, seed) {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  const f = x - i, g = y - j, h = z - k;
  const u = f * f * (3 - 2 * f), v = g * g * (3 - 2 * g), w = h * h * (3 - 2 * h);
  const L2 = (a, b, t) => a + (b - a) * t;
  const c = (a, b, d) => hash3(i + a, j + b, k + d, seed);
  return L2(L2(L2(c(0, 0, 0), c(1, 0, 0), u), L2(c(0, 1, 0), c(1, 1, 0), u), v), L2(L2(c(0, 0, 1), c(1, 0, 1), u), L2(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
function fbm3(x, y, z, seed, oct = 4) {
  let a = 0.5, s = 0, n = 0;
  for (let o = 0; o < oct; o++) {
    s += a * (noise3(x, y, z, seed + o) - 0.5);
    n += a;
    const nx = x * 0.8 + z * 0.6, nz = -x * 0.6 + z * 0.8;
    x = nx * 2.03;
    y = y * 2.03 + 1.7;
    z = nz * 2.03;
    a *= 0.5;
  }
  return s / n;
}

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/species.ts
import * as THREE5 from "three";

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/foliage.ts
import * as THREE4 from "three";

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/wind.ts
import * as THREE3 from "three";

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/surfaces.ts
var SURF = {
  plain: 0,
  brick: 1,
  ashlar: 2,
  cobble: 3,
  plaster: 4,
  clapboard: 5,
  boards: 6,
  thatch: 7,
  clayTile: 8,
  slate: 9,
  steel: 10,
  glass: 11,
  asphalt: 12,
  marble: 13,
  adobe: 14,
  flagstone: 15,
  glazed: 16,
  cloth: 17,
  snow: 18,
  // Bark, by kind of tree: deep furrows (oak, pine), peeling plates (plane), lenticels (birch,
  // cherry), smooth mottled (magnolia, citrus), ringed leaf scars (palms).
  barkFurrowed: 19,
  barkPlates: 20,
  barkLenticel: 21,
  barkSmooth: 22,
  barkRinged: 23
};
var L = (walls, roofs, road) => ({ walls, roofs, road });
var LAND_SURFACES = {
  aurora: L(["clapboard", "clapboard", "boards"], ["snow", "snow"], "snow"),
  norway: L(["clapboard", "clapboard", "clapboard", "clapboard"], ["slate", "boards", "thatch"], "cobble"),
  switzerland: L(["boards", "plaster", "boards"], ["slate", "slate"], "cobble"),
  london: L(["brick", "brick", "ashlar", "brick"], ["slate", "slate"], "asphalt"),
  newyork: L(["ashlar", "ashlar", "steel", "glass", "brick"], ["steel"], "asphalt"),
  korea: L(["plaster", "plaster"], ["clayTile", "clayTile"], "flagstone"),
  japan: L(["plaster", "boards", "plaster"], ["clayTile", "clayTile", "clayTile"], "flagstone"),
  meadow: L(["ashlar", "plaster", "ashlar", "ashlar"], ["slate", "slate", "slate", "slate"], "cobble"),
  renaissance: L(["plaster", "plaster", "ashlar", "brick"], ["clayTile", "clayTile"], "flagstone"),
  vintage: L(["clapboard", "clapboard", "clapboard", "clapboard", "clapboard"], ["slate", "slate", "slate"], "asphalt"),
  china: L(["boards", "plaster", "boards"], ["glazed", "glazed", "clayTile"], "flagstone"),
  indonesia: L(["boards", "boards", "thatch"], ["thatch", "thatch", "thatch"], "plain"),
  skyisles: L(["marble", "marble", "marble"], ["glazed", "glazed", "glazed"], "marble"),
  islamic: L(["plaster", "plaster", "plaster"], ["glazed", "glazed", "glazed"], "flagstone"),
  middleeast: L(["adobe", "adobe", "adobe"], ["adobe", "adobe"], "flagstone"),
  indiasouth: L(["plaster", "brick", "ashlar"], ["clayTile", "clayTile"], "plain"),
  indianorth: L(["ashlar", "ashlar", "ashlar", "plaster"], ["ashlar", "plaster"], "cobble"),
  mughal: L(["ashlar", "marble", "ashlar"], ["marble", "marble"], "flagstone"),
  egypt: L(["ashlar", "adobe", "ashlar"], ["adobe"], "flagstone"),
  desert: L(["cloth", "cloth", "adobe"], ["cloth", "cloth", "cloth"], "plain")
};
var SURFACE_GLSL = (
  /* glsl */
  `
  float sh1(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float sn2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(sh1(i), sh1(i + vec2(1, 0)), f.x), mix(sh1(i + vec2(0, 1)), sh1(i + vec2(1, 1)), f.x), f.y); }
  float sfbm(vec2 p) { return sn2(p) * 0.5 + sn2(p * 2.1 + 3.7) * 0.3 + sn2(p * 4.3 - 1.3) * 0.2; }
  // Courses of blocks w \xD7 h with a running bond; returns (block shade, groove).
  vec2 courses(vec2 st, vec2 size, float bond, float mortar, float vary) {
    float row = floor(st.y / size.y);
    vec2 q = vec2(st.x / size.x + bond * mod(row, 2.0) + sh1(vec2(row, 3.0)) * 0.13 * step(0.5, vary), st.y / size.y);
    vec2 id = floor(q), f = fract(q);
    float edge = min(min(f.x, 1.0 - f.x) * size.x, min(f.y, 1.0 - f.y) * size.y);
    float groove = 1.0 - smoothstep(mortar * 0.5, mortar, edge);
    return vec2(1.0 + (sh1(id) - 0.5) * vary, groove);
  }
  vec2 cells(vec2 p, float jitter) {
    vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0; vec2 best = vec2(0.0);
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y)), o = vec2(sh1(i + g), sh1(i + g + 7.1)) * jitter;
      float d = length(g + o - f);
      if (d < d1) { d2 = d1; d1 = d; best = i + g; } else if (d < d2) d2 = d;
    }
    return vec2(sh1(best), d2 - d1);
  }
  vec2 surfaceRaw(float id, vec2 st) {
    float n = sfbm(st * 3.0);
    if (id < 0.5) return vec2(1.0, 0.0);
    if (id < 1.5) { vec2 b = courses(st, vec2(0.24, 0.075), 0.5, 0.012, 0.3); return vec2(b.x * (0.94 + n * 0.1), b.y); }        // brick
    if (id < 2.5) { vec2 b = courses(st, vec2(0.62, 0.31), 0.35, 0.014, 0.14); return vec2(b.x * (0.93 + n * 0.12), b.y * 0.8); } // ashlar
    if (id < 3.5) { vec2 c = cells(st * 5.2, 0.9); return vec2(0.82 + c.x * 0.3, 1.0 - smoothstep(0.02, 0.1, c.y)); }             // cobble
    if (id < 4.5) return vec2(0.95 + sfbm(st * 6.0) * 0.08 + sn2(st * 40.0) * 0.03, 0.0);                                          // plaster
    if (id < 5.5) { float r = fract(st.y / 0.17); float lap = smoothstep(0.0, 0.25, r); return vec2((0.88 + lap * 0.14) * (0.95 + sn2(vec2(st.x * 3.0, st.y * 40.0)) * 0.08), 1.0 - smoothstep(0.0, 0.07, r)); } // clapboard
    if (id < 6.5) { float c = fract(st.x / 0.19); float grain = sn2(vec2(st.x * 30.0, st.y * 2.5)); return vec2((0.86 + grain * 0.2) * (0.94 + sh1(vec2(floor(st.x / 0.19), 1.0)) * 0.12), 1.0 - smoothstep(0.0, 0.05, min(c, 1.0 - c))); } // boards
    if (id < 7.5) { float strands = sn2(vec2(st.x * 55.0, st.y * 4.0)) * 0.6 + sn2(vec2(st.x * 120.0, st.y * 9.0)) * 0.4; float rowL = fract(st.y / 0.28); return vec2(0.78 + strands * 0.36, (1.0 - smoothstep(0.0, 0.14, rowL)) * 0.7); } // thatch
    if (id < 8.5) { float row = floor(st.y / 0.24), x = st.x / 0.19 + 0.5 * mod(row, 2.0); float barrel = 0.5 + 0.5 * cos(fract(x) * 6.2832); float rowL = fract(st.y / 0.24);
      return vec2((0.8 + barrel * 0.28) * (0.93 + sh1(vec2(floor(x), row)) * 0.14), (1.0 - smoothstep(0.0, 0.12, rowL)) * 0.8); } // clay tiles
    if (id < 9.5) { vec2 b = courses(st, vec2(0.32, 0.19), 0.5, 0.018, 0.22); float rowL = fract(st.y / 0.19); return vec2(b.x * (0.9 + rowL * 0.12), max(b.y * 0.7, 1.0 - smoothstep(0.0, 0.1, rowL))); } // slate
    if (id < 10.5) { vec2 b = courses(st, vec2(1.2, 0.6), 0.0, 0.02, 0.06); float brushed = sn2(vec2(st.x * 2.0, st.y * 80.0)); vec2 rv = fract(st / vec2(0.3, 0.6)); float rivet = step(length((rv - vec2(0.5, 0.06)) * vec2(0.3, 0.6)), 0.012);
      return vec2(b.x * (0.92 + brushed * 0.12) + rivet * 0.25, b.y * 0.8); } // steel panels
    if (id < 11.5) { vec2 g = fract(st / vec2(1.5, 1.2)); float mull = 1.0 - smoothstep(0.0, 0.03, min(min(g.x, 1.0 - g.x) * 1.5, min(g.y, 1.0 - g.y) * 1.2));
      return vec2(0.75 + (1.0 - g.y) * 0.5 + sh1(floor(st / vec2(1.5, 1.2))) * 0.15, mull * 0.6); } // glass curtain wall
    if (id < 12.5) return vec2(0.86 + sn2(st * 30.0) * 0.12 + step(0.97, sh1(floor(st * 40.0))) * 0.2, 0.0); // asphalt
    if (id < 13.5) { float v = abs(sin(st.x * 2.3 + st.y * 1.1 + sfbm(st * 1.6) * 7.0)); return vec2(1.02 - (1.0 - smoothstep(0.0, 0.06, v)) * 0.16, 0.0); } // marble
    if (id < 14.5) { float fleck = step(0.985, sh1(floor(st * vec2(90.0, 30.0)))), dark = step(0.975, sh1(floor(st * vec2(70.0, 70.0)) + 5.0)), sand = sh1(floor(st * 55.0)) * 0.07;
      float trowel = sn2(vec2(st.x * 2.0 + st.y * 0.7, st.y * 6.0)) * 0.07;
      return vec2(0.9 + sfbm(st * 2.5) * 0.12 + sand + trowel + fleck * 0.12 - dark * 0.14, 0.0); } // adobe: sandy grain, trowel sweeps, flecks of straw and grit
    if (id < 15.5) { vec2 b = courses(st, vec2(0.58, 0.44), 0.42, 0.02, 0.2); return vec2(b.x * (0.93 + n * 0.1), b.y); } // flagstones
    if (id < 16.5) { vec2 g = fract(st / 0.15); float gl = 0.5 + 0.5 * sin(fract(st.x / 0.15) * 3.1416); float edge = 1.0 - smoothstep(0.0, 0.06, min(min(g.x, 1.0 - g.x), min(g.y, 1.0 - g.y)));
      return vec2((0.86 + gl * 0.24) * (0.92 + sh1(floor(st / 0.15)) * 0.16), edge * 0.7); } // glazed tiles
    if (id < 17.5) { float strip = fract(st.y / 0.62); float seam = 1.0 - smoothstep(0.0, 0.06, min(strip, 1.0 - strip));
      float fib = sn2(vec2(st.x * 45.0, st.y * 11.0)) * 0.55 + sh1(floor(st * vec2(110.0, 34.0))) * 0.45;
      float slub = sn2(vec2(st.x * 3.0, st.y * 26.0)) * 0.12;
      float stripe = step(0.86, fract(st.y / 0.62 + 0.4));
      return vec2((0.8 + fib * 0.26 + slub) * (1.0 - seam * 0.32) * (1.0 - stripe * 0.2), seam * 0.5); } // hand-spun woven strips: coarse grainy fibres, slubs, sewn seams
    if (id < 18.5) { vec2 b = courses(st, vec2(0.55, 0.32), 0.5, 0.02, 0.06); return vec2(b.x, b.y * 0.5); } // snow blocks
    if (id < 19.5) { float f = sfbm(vec2(st.x * 13.0, st.y * 1.2)); float ridge = smoothstep(0.38, 0.62, f);
      return vec2(0.72 + ridge * 0.42 + sn2(st * 40.0) * 0.06, (1.0 - smoothstep(0.3, 0.45, f)) * 0.9); } // furrowed bark: long ridges split by deep cracks
    if (id < 20.5) { float p = sfbm(st * 2.6 + 4.0), q = sfbm(st * 5.1 - 2.0);
      float shade = p > 0.55 ? 1.14 : (q > 0.5 ? 0.86 : 0.98);
      return vec2(shade * (0.95 + sn2(st * 24.0) * 0.08), (1.0 - smoothstep(0.0, 0.02, abs(p - 0.55))) * 0.5); } // plates: patches of fresh and weathered bark
    if (id < 21.5) { vec2 q = st * vec2(3.2, 13.0); float dash = step(0.9, sh1(floor(q))) * (1.0 - smoothstep(0.18, 0.42, abs(fract(q.y) - 0.5)));
      float mark = smoothstep(0.66, 0.74, sfbm(st * vec2(2.2, 3.6) + 9.0));
      return vec2(1.02 + sn2(st * 18.0) * 0.05 - dash * 0.55 - mark * 0.6, 0.0); } // lenticels: dark dashes across the trunk, black knots
    if (id < 22.5) return vec2(0.92 + sfbm(st * vec2(5.0, 1.8)) * 0.14 + sn2(st * 30.0) * 0.04, 0.0); // smooth, mottled bark
    { float ring = fract(st.y / 0.16 + sn2(vec2(st.x * 2.0, st.y)) * 0.2); float scar = 1.0 - smoothstep(0.0, 0.18, min(ring, 1.0 - ring));
      return vec2(0.84 + sn2(vec2(st.x * 30.0, st.y * 3.0)) * 0.2, scar * 0.8); } // ringed palm trunk: the scars of fallen fronds
  }
  // The size of each surface's smallest repeating detail (metres), for fading it out before it aliases.
  float surfacePeriod(float id) {
    if (id < 1.5) return 0.075; if (id < 2.5) return 0.31; if (id < 3.5) return 0.19; if (id < 4.5) return 0.1;
    if (id < 5.5) return 0.17; if (id < 6.5) return 0.19; if (id < 7.5) return 0.05; if (id < 8.5) return 0.19;
    if (id < 9.5) return 0.19; if (id < 10.5) return 0.6; if (id < 11.5) return 1.2; if (id < 12.5) return 0.05;
    if (id < 13.5) return 0.5; if (id < 14.5) return 0.2; if (id < 15.5) return 0.44; if (id < 16.5) return 0.15;
    if (id < 17.5) return 0.12; if (id < 18.5) return 0.32; if (id < 19.5) return 0.07; if (id < 20.5) return 0.2;
    if (id < 21.5) return 0.07; if (id < 22.5) return 0.18; return 0.16;
  }
  vec2 surface(float id, vec3 wp, vec3 wn) {
    vec3 an = abs(wn);
    // Level only when the face looks more up than out (compared with its whole horizontal lean, so
    // a slope facing a diagonal \u2014 a pyramid turned 45\xB0, a hipped roof \u2014 still counts as a slope).
    float lean = length(wn.xz);
    bool level = an.y > lean;
    // Walls and slopes: along the face and up it, courses always level; flat faces: across the
    // ground. On a slope the courses are spaced by distance up the slope, not by height.
    vec2 st = level ? wp.xz : (an.x > an.z ? vec2(wp.z, wp.y) : vec2(wp.x, wp.y));
    if (!level) st.y /= max(lean, 0.35);
    // How many metres one pixel covers here; the pattern fades once its detail nears a pixel.
    float px = max(length(dFdx(st)), length(dFdy(st)));
    float per = surfacePeriod(id);
    float aa = 1.0 - smoothstep(per * 0.12, per * 0.4, px);
    if (aa < 0.01) return vec2(1.0, 0.0);
    return mix(vec2(1.0, 0.0), surfaceRaw(id, st), aa);
  }`
);

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/lamplight.ts
import * as THREE2 from "three";
var LAMP_MAX = 24;
var LAMP_UNIFORMS = {
  uLamps: { value: Array.from({ length: LAMP_MAX }, () => new THREE2.Vector4(0, -1e4, 0, 1e-3)) },
  uLampCol: { value: Array.from({ length: LAMP_MAX }, () => new THREE2.Color(0, 0, 0)) },
  /** 0 by day … 1 at night: how strongly the lamps show. */
  uLampOn: { value: 0 }
};
var LAMP_GLSL = (
  /* glsl */
  `
  uniform vec4 uLamps[${LAMP_MAX}];
  uniform vec3 uLampCol[${LAMP_MAX}];
  uniform float uLampOn;
  vec3 lampLight(vec3 wp, vec3 n) {
    vec3 sum = vec3(0.0);
    if (uLampOn < 0.01) return sum;
    for (int i = 0; i < ${LAMP_MAX}; i++) {
      vec3 d = uLamps[i].xyz - wp;
      float r = uLamps[i].w, dist = length(d);
      if (dist > r) continue;
      float k = 1.0 - dist / r;
      float face = 0.35 + 0.65 * max(dot(n, d / max(dist, 0.001)), 0.0);
      sum += uLampCol[i] * k * sqrt(k) * face;
    }
    return sum * uLampOn;
  }`
);

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/wind.ts
var WIND_UNIFORMS = {
  uWindTime: { value: 0 },
  uWindDir: { value: new THREE3.Vector2(1, 0) },
  uWindStrength: { value: 0.6 }
};
var WIND_GLSL = (
  /* glsl */
  `
  uniform float uWindTime; uniform vec2 uWindDir; uniform float uWindStrength;
  float wNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453), b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453), d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  vec2 windOffset(vec3 wp, float weight) {
    vec2 across = vec2(-uWindDir.y, uWindDir.x);
    float along = dot(wp.xz, uWindDir), side = dot(wp.xz, across);
    // Gusts: patches of stronger wind, each its own shape, drifting downwind at an easy pace, with
    // lulls between them \u2014 not one wave sweeping the whole field.
    float g = wNoise(vec2(along * 0.03 - uWindTime * 0.16, side * 0.045)) * 0.65 + wNoise(vec2(along * 0.08 - uWindTime * 0.27, side * 0.11 + 3.7)) * 0.35;
    float gust = 0.25 + 0.95 * smoothstep(0.3, 0.8, g);
    // Sway: slow, every plant a little out of step with its neighbours.
    float ph = wNoise(wp.xz * 0.6) * 6.2832;
    float wave = sin(uWindTime * 1.1 - along * 0.15 + ph) * 0.55 + sin(uWindTime * 1.9 + ph * 1.7) * 0.15;
    return uWindDir * (0.55 + wave * 0.5) * gust * uWindStrength * weight;
  }`
);
var FOLIAGE_UNIFORMS = {
  uSunDir: { value: new THREE3.Vector3(0, 1, 0) },
  uLeafNight: { value: 0 },
  /** The season's turn of the green leaves (seasons.ts `leafSeason`): the colour, and how far. */
  uSeasonTint: { value: new THREE3.Vector3(1, 1, 1) },
  uSeasonAmt: { value: 0 }
};
var LEAF_FRAG = (
  /* glsl */
  `
  if (vLeaf > 0.5) {
    // The crown painted as a mass of overlapping leaves (projected from the side it faces): in
    // each small cell a leaf at its own angle and shade, the top-most one showing, dark gaps
    // between them. On colourful trees every leaf takes its own hue.
    vec3 an = abs(normalize(vLN));
    vec2 uvL = (an.y > max(an.x, an.z) ? vLW.xz : (an.x > an.z ? vLW.zy : vLW.xy)) * 3.4;
    vec2 ci = floor(uvL);
    float best = 0.0, shade = 0.5, hue = 0.5;
    for (int yy = -1; yy <= 1; yy++) for (int xx = -1; xx <= 1; xx++) {
      vec2 cc = ci + vec2(float(xx), float(yy));
      float hA = fract(sin(dot(cc, vec2(12.9898, 78.233))) * 43758.5453);
      float hB = fract(sin(dot(cc, vec2(39.3468, 11.135))) * 43758.5453);
      vec2 d = uvL - (cc + 0.5 + (vec2(hA, hB) - 0.5) * 0.8);
      float a = hA * 6.2832;
      d = mat2(cos(a), -sin(a), sin(a), cos(a)) * d;
      float leafv = 1.0 - smoothstep(0.42, 0.6, length(d * vec2(1.0, 2.1)));
      float z = leafv * (0.4 + hB);
      if (z > best) { best = z; shade = hB * 0.6 + 0.4 + d.x * 0.35; hue = hA; }
    }
    float onLeaf = smoothstep(0.02, 0.12, best);
    vec3 base = diffuseColor.rgb;
    // The season (seasons.ts): green leaves turn towards the season's colour, leaf by leaf.
    float greenLeaf = smoothstep(0.02, 0.1, base.g - max(base.r, base.b));
    vec3 turned = uSeasonTint * dot(base, vec3(0.35, 0.5, 0.15)) * 1.9 * mix(0.85, 1.15, hue);
    base = mix(base, turned, uSeasonAmt * greenLeaf * (0.7 + 0.3 * hue));
    float sat = max(base.r, max(base.g, base.b)) - min(base.r, min(base.g, base.b));
    float colourful = smoothstep(0.05, 0.25, sat) * (1.0 - smoothstep(0.0, 0.08, base.g - max(base.r, base.b)));
    vec3 tint = hue < 0.5 ? vec3(1.14, 0.94, 0.9) : vec3(0.92, 0.98, 1.14);
    vec3 leafCol = base * mix(vec3(1.0), tint, colourful * abs(hue - 0.5) * 1.6) * (0.8 + shade * 0.35);
    diffuseColor.rgb = mix(base * 0.5, leafCol, onLeaf);
    // At the crown's edge the gaps between the leaves are open sky: a leafy outline, not a ball.
    float rim = 1.0 - abs(dot(normalize(vLN), normalize(cameraPosition - vLW)));
    if (rim > 0.5 && onLeaf < 0.5) discard;
    vLeafGlow = 1.0;
    // Some leaves hold a little light of their own, which shows as dusk falls (like the flowers).
    vLeafLum = onLeaf * (0.35 + 0.65 * step(0.55, fract(hue * 7.31 + shade * 3.1)));
  }`
);
function swayMaterial(mat, amount = 0.45, leaves = false, surfaces = false) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, WIND_UNIFORMS, leaves ? FOLIAGE_UNIFORMS : {}, leaves ? LAMP_UNIFORMS : {});
    sh.vertexShader = sh.vertexShader.replace("#include <common>", `#include <common>
attribute float sway;
${WIND_GLSL}${leaves ? "\nattribute float leaf; varying float vLeaf; varying vec3 vLW; varying vec3 vLN;" : ""}${surfaces ? "\nattribute float surf; varying float vSurf;" : ""}`).replace("#include <begin_vertex>", `#include <begin_vertex>
if (sway > 0.0) { vec3 wpS = (modelMatrix * vec4(transformed, 1.0)).xyz; transformed.xz += windOffset(wpS, sway) * ${amount.toFixed(3)}; }`);
    if (!leaves) return;
    sh.vertexShader = sh.vertexShader.replace("#include <project_vertex>", `#include <project_vertex>
      vLeaf = leaf; vLW = (modelMatrix * vec4(transformed, 1.0)).xyz; vLN = normalize(mat3(modelMatrix) * objectNormal);${surfaces ? " vSurf = surf;" : ""}`);
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
        varying float vLeaf; varying vec3 vLW; varying vec3 vLN; uniform vec3 uSunDir; uniform float uLeafNight;
        uniform vec3 uSeasonTint; uniform float uSeasonAmt;
        ${LAMP_GLSL}${surfaces ? `
varying float vSurf;
${SURFACE_GLSL}` : ""}`).replace("#include <color_fragment>", `#include <color_fragment>
        float vLeafGlow = 0.0, vLeafLum = 0.0;
        ${LEAF_FRAG}
        ${surfaces ? `if (vSurf > 0.5) {
          // What the wall, roof or road is made of (surfaces.ts), fading to plain colour far away.
          vec2 sg = surface(vSurf, vLW, normalize(vLN));
          float sfade = 1.0 - smoothstep(45.0, 140.0, length(vLW - cameraPosition));
          diffuseColor.rgb *= mix(1.0, sg.x * (1.0 - sg.y * 0.45), sfade);
        }` : ""}`).replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        if (vLeafGlow > 0.5) {
          // Sunlight through the leaves, and a soft inner light so crowns never go dead-dark.
          float back = pow(max(dot(normalize(vLW - cameraPosition), normalize(uSunDir)), 0.0), 3.0);
          totalEmissiveRadiance += diffuseColor.rgb * (back * 0.6 + 0.07) * (1.0 - uLeafNight);
          // After dusk the crowns glow faintly, leaf by leaf.
          totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(0.75, 1.0, 0.8), 0.25) * vLeafLum * uLeafNight * 0.3;
        }
        // Lamplight on the walls, trees and props near each lamp after dusk (lamplight.ts).
        totalEmissiveRadiance += diffuseColor.rgb * lampLight(vLW, normalize(vLN)) * 0.85;`);
  };
  mat.customProgramCacheKey = () => "sway" + amount + (leaves ? "-leaves" : "") + (surfaces ? "-surfaces" : "") + (leaves ? "-lamps" : "");
  return mat;
}

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/foliage.ts
var CARD_STRIDE = 14;
var LeafKind = { Broad: 0, Small: 1, Needles: 2, Blossom: 3, Frond: 4, Bamboo: 5, Banana: 6, Crystal: 7 };
function leafAtlas() {
  if (typeof document === "undefined") return null;
  const C = 256, c = document.createElement("canvas");
  c.width = C * 4;
  c.height = C * 2;
  const x = c.getContext("2d");
  let seed = 17;
  const r = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const grey = (v) => `rgb(${Math.round(v * 0.95)},${Math.round(v)},${Math.round(v * 0.88)})`;
  const leaf = (lx, ly, len, wid, a, v, lobed = false) => {
    x.save();
    x.translate(lx, ly);
    x.rotate(a);
    x.fillStyle = grey(v);
    x.beginPath();
    x.moveTo(0, 0);
    if (lobed) {
      for (let i = 0; i <= 6; i++) {
        const t2 = i / 6;
        x.lineTo(t2 * len, -wid * Math.sin(t2 * Math.PI) * (i % 2 ? 1 : 0.72));
      }
      for (let i = 6; i >= 0; i--) {
        const t2 = i / 6;
        x.lineTo(t2 * len, wid * Math.sin(t2 * Math.PI) * (i % 2 ? 1 : 0.72));
      }
    } else {
      x.quadraticCurveTo(len * 0.45, -wid, len, 0);
      x.quadraticCurveTo(len * 0.45, wid, 0, 0);
    }
    x.fill();
    x.strokeStyle = grey(Math.min(255, v + 45));
    x.lineWidth = 1.2;
    x.beginPath();
    x.moveTo(0, 0);
    x.lineTo(len * 0.9, 0);
    x.stroke();
    x.restore();
  };
  const cell = (i, draw) => {
    x.save();
    x.beginPath();
    x.rect(i % 4 * C + 4, Math.floor(i / 4) * C + 4, C - 8, C - 8);
    x.clip();
    draw(i % 4 * C + C / 2, Math.floor(i / 4) * C + C / 2);
    x.restore();
  };
  cell(0, (cx, cy) => {
    for (let i = 0; i < 26; i++) {
      const a = r() * Math.PI * 2, d = r() * 70;
      leaf(cx + Math.cos(a) * d - Math.cos(a) * 30, cy + Math.sin(a) * d - Math.sin(a) * 30, 46 + r() * 30, 17 + r() * 8, a + (r() - 0.5) * 0.8, 150 + r() * 90, r() < 0.4);
    }
  });
  cell(1, (cx, cy) => {
    x.strokeStyle = "rgb(120,110,95)";
    x.lineWidth = 2;
    for (let t2 = 0; t2 < 7; t2++) {
      const a = t2 / 7 * Math.PI * 2 + r();
      x.beginPath();
      x.moveTo(cx, cy);
      x.lineTo(cx + Math.cos(a) * 110, cy + Math.sin(a) * 110);
      x.stroke();
    }
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = 20 + r() * 95;
      leaf(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 20 + r() * 12, 7 + r() * 4, a + (r() - 0.5) * 1.6, 150 + r() * 95);
    }
  });
  cell(2, (cx, cy) => {
    for (let b = 0; b < 14; b++) {
      const a0 = r() * Math.PI * 2, d = r() * 70, bx = cx + Math.cos(a0) * d, by = cy + Math.sin(a0) * d;
      for (let k = 0; k < 22; k++) {
        const a = a0 + (r() - 0.5) * 2.4, len = 26 + r() * 30;
        x.strokeStyle = grey(140 + r() * 100);
        x.lineWidth = 1.6;
        x.beginPath();
        x.moveTo(bx, by);
        x.lineTo(bx + Math.cos(a) * len, by + Math.sin(a) * len);
        x.stroke();
      }
    }
  });
  cell(3, (cx, cy) => {
    for (let i = 0; i < 8; i++) {
      const a = r() * Math.PI * 2, d = r() * 80;
      leaf(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 34, 12, a, 120 + r() * 40);
    }
    for (let i = 0; i < 34; i++) {
      const a = r() * Math.PI * 2, d = r() * 100, fx = cx + Math.cos(a) * d, fy = cy + Math.sin(a) * d, pr = 9 + r() * 6;
      for (let k = 0; k < 5; k++) {
        const pa = k / 5 * Math.PI * 2 + a;
        x.fillStyle = k % 2 ? "rgb(252,250,248)" : "rgb(236,232,232)";
        x.beginPath();
        x.ellipse(fx + Math.cos(pa) * pr * 0.7, fy + Math.sin(pa) * pr * 0.7, pr * 0.62, pr * 0.46, pa, 0, Math.PI * 2);
        x.fill();
      }
      x.fillStyle = "rgb(246,200,80)";
      x.beginPath();
      x.arc(fx, fy, pr * 0.28, 0, Math.PI * 2);
      x.fill();
    }
  });
  cell(4, (cx, cy) => {
    x.strokeStyle = grey(200);
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(cx, cy + 124);
    x.lineTo(cx, cy - 124);
    x.stroke();
    for (let i = 0; i < 22; i++) {
      const yy = cy + 118 - i * 11;
      for (const sd of [-1, 1]) leaf(cx, yy, 64 + r() * 34 - i * 1.2, 5 + r() * 2, sd < 0 ? Math.PI + 0.55 + (r() - 0.5) * 0.2 : -0.55 + (r() - 0.5) * 0.2, 150 + r() * 80);
    }
  });
  cell(5, (cx, cy) => {
    x.strokeStyle = "rgb(150,150,110)";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(cx - 100, cy + 100);
    x.lineTo(cx + 60, cy - 60);
    x.stroke();
    for (let i = 0; i < 16; i++) {
      const t2 = i / 16, bx = cx - 100 + t2 * 160, by = cy + 100 - t2 * 160;
      leaf(bx, by, 90 + r() * 30, 9 + r() * 3, -0.8 + (i % 2 ? 1 : -1) * (0.5 + r() * 0.5), 150 + r() * 90);
    }
  });
  cell(6, (cx, cy) => {
    x.fillStyle = grey(190);
    x.beginPath();
    x.moveTo(cx, cy + 126);
    x.bezierCurveTo(cx - 118, cy + 60, cx - 118, cy - 70, cx, cy - 126);
    x.bezierCurveTo(cx + 118, cy - 70, cx + 118, cy + 60, cx, cy + 126);
    x.fill();
    x.strokeStyle = grey(235);
    x.lineWidth = 4;
    x.beginPath();
    x.moveTo(cx, cy + 126);
    x.lineTo(cx, cy - 126);
    x.stroke();
    x.strokeStyle = grey(160);
    x.lineWidth = 1.2;
    for (let i = 0; i < 26; i++) {
      const yy = cy + 110 - i * 9;
      for (const sd of [-1, 1]) {
        x.beginPath();
        x.moveTo(cx, yy);
        x.lineTo(cx + sd * 110, yy - 34);
        x.stroke();
      }
    }
    x.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 7; i++) {
      const yy = cy + 90 - i * 28 - r() * 10, sd = r() < 0.5 ? -1 : 1;
      x.beginPath();
      x.moveTo(cx + sd * 120, yy - 30);
      x.lineTo(cx + sd * (20 + r() * 30), yy - 4);
      x.lineTo(cx + sd * 120, yy - 26);
      x.fill();
    }
    x.globalCompositeOperation = "source-over";
  });
  cell(7, (cx, cy) => {
    for (let i = 0; i < 14; i++) {
      const a = r() * Math.PI * 2, d = r() * 80, px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d, len = 34 + r() * 26, wd = 10 + r() * 6;
      x.save();
      x.translate(px, py);
      x.rotate(a + (r() - 0.5));
      x.fillStyle = grey(200 + r() * 55);
      x.beginPath();
      x.moveTo(0, 0);
      x.lineTo(len * 0.4, -wd);
      x.lineTo(len, 0);
      x.lineTo(len * 0.4, wd);
      x.closePath();
      x.fill();
      x.strokeStyle = "rgb(255,255,255)";
      x.lineWidth = 1.5;
      x.beginPath();
      x.moveTo(0, 0);
      x.lineTo(len, 0);
      x.moveTo(len * 0.4, -wd);
      x.lineTo(len * 0.4, wd);
      x.stroke();
      x.restore();
    }
  });
  const t = new THREE4.CanvasTexture(c);
  t.colorSpace = THREE4.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
var blobMat = null;
function blobMaterial() {
  return blobMat ??= swayMaterial(new THREE4.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), 0.45, true);
}
var cardMat = null;
function cardMaterial() {
  if (cardMat) return cardMat;
  const m = new THREE4.MeshLambertMaterial({ map: leafAtlas(), alphaTest: 0.45, side: THREE4.DoubleSide });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, WIND_UNIFORMS, FOLIAGE_UNIFORMS);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", `#include <common>
        attribute float aKind; attribute float aSway; varying float vKind; varying vec3 vCW;
        ${WIND_GLSL}`).replace("#include <uv_vertex>", `#include <uv_vertex>
        vMapUv = (clamp(vMapUv, 0.02, 0.98) + vec2(mod(aKind, 4.0), 1.0 - floor(aKind / 4.0))) * vec2(0.25, 0.5);`).replace("#include <project_vertex>", `
        vKind = aKind;
        vec4 wpC = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        vec2 wo = windOffset(wpC.xyz, aSway) * 0.45;
        // A little flutter of each card on top of the branch's sway.
        wo += vec2(sin(uWindTime * 5.3 + wpC.x * 2.1), cos(uWindTime * 4.7 + wpC.z * 1.9)) * 0.035 * aSway * uWindStrength;
        wpC.xz += wo;
        vCW = wpC.xyz;
        vec4 mvPosition = viewMatrix * wpC;
        gl_Position = projectionMatrix * mvPosition;`);
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", `#include <common>
        varying float vKind; varying vec3 vCW; uniform vec3 uSunDir; uniform float uLeafNight;
        uniform vec3 uSeasonTint; uniform float uSeasonAmt;`).replace("#include <color_fragment>", `
        vec3 tx = diffuseColor.rgb;
        #ifdef USE_COLOR
          // Blossom cards: only the petals take the tree's colour; leaves and hearts keep their paint.
          float petalW = vKind > 2.5 ? smoothstep(0.7, 0.85, min(tx.r, min(tx.g, tx.b))) : 1.0;
          diffuseColor.rgb = mix(tx * vec3(0.55, 0.85, 0.5), tx * vColor.rgb, petalW);
        #endif
        {
          // The season (seasons.ts): green broad and small leaves turn, sprig by sprig; needles,
          // blossom, fronds and crystals never do.
          float greenC = smoothstep(0.02, 0.1, diffuseColor.g - max(diffuseColor.r, diffuseColor.b)) * step(vKind, 1.5);
          float hv = fract(sin(dot(floor(vCW * 2.3), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
          vec3 turnedC = uSeasonTint * dot(diffuseColor.rgb, vec3(0.35, 0.5, 0.15)) * 1.9 * mix(0.8, 1.2, hv);
          diffuseColor.rgb = mix(diffuseColor.rgb, turnedC, uSeasonAmt * greenC * (0.6 + 0.4 * hv));
        }`).replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        {
          // Sunlight coming through the leaves, and a soft light within so crowns never go dead-dark.
          float back = pow(max(dot(normalize(vCW - cameraPosition), normalize(uSunDir)), 0.0), 3.0);
          totalEmissiveRadiance += diffuseColor.rgb * (back * 0.55 + 0.1) * (1.0 - uLeafNight);
          // After dusk the leaves glow faintly, as the flowers do: some sprigs brighter than others.
          float lum = 0.35 + 0.65 * step(0.55, fract(sin(dot(floor(vCW * 1.7), vec3(12.9898, 78.233, 37.719))) * 43758.5453));
          totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(0.75, 1.0, 0.8), 0.25) * lum * uLeafNight * 0.3;
        }`);
  };
  m.customProgramCacheKey = () => "leaf-cards";
  return cardMat = m;
}

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/species.ts
var UP = new THREE5.Vector3(0, 1, 0);
var X = new THREE5.Vector3(1, 0, 0);
var Y = new THREE5.Vector3(0, 1, 0);
var Z = new THREE5.Vector3(0, 0, 1);
var _q = new THREE5.Quaternion();
var _m = new THREE5.Matrix4();
var ONE = new THREE5.Vector3(1, 1, 1);
function stem(g, p0, p1, r0, r1, col2, seg = 7) {
  const d = new THREE5.Vector3().subVectors(p1, p0), L2 = d.length();
  if (L2 < 1e-3) return;
  d.divideScalar(L2);
  const geo = new THREE5.CylinderGeometry(r1, r0, L2 + r0 * 0.3, seg, 1, true);
  geo.translate(0, (L2 + r0 * 0.3) / 2, 0);
  g.add(geo, col2, _m.compose(p0.clone().addScaledVector(d, -r0 * 0.3), _q.setFromUnitVectors(UP, d), ONE).clone());
}
function cardAlong(g, p, n, t, size, col2, kind, sway) {
  const q = new THREE5.Quaternion().setFromUnitVectors(Z, n);
  const u = X.clone().applyQuaternion(q), v = Y.clone().applyQuaternion(q);
  g.card(p.x, p.y, p.z, n.x, n.y, n.z, size, col2, kind, sway, Math.atan2(-t.dot(u), t.dot(v)), 0);
}
var col = new THREE5.Color();
var jitter = (c, rng, h = 0.03, l = 0.1) => col.set(c).offsetHSL((rng() - 0.5) * h, 0, (rng() - 0.5) * l).clone();
function curve(pts, n) {
  return new THREE5.CatmullRomCurve3(pts).getPoints(n);
}
function palm(g, x, y, z, s, rng, coconut) {
  const h = (coconut ? 7 : 8) * s * (0.85 + rng() * 0.3), lean = rng() * Math.PI * 2, bend = (coconut ? 0.22 : 0.08) * h;
  const dir = new THREE5.Vector3(Math.cos(lean), 0, Math.sin(lean));
  const spine = curve([
    new THREE5.Vector3(x, y - 0.2, z),
    new THREE5.Vector3(x, y + h * 0.35, z).addScaledVector(dir, bend * 0.25),
    new THREE5.Vector3(x, y + h * 0.7, z).addScaledVector(dir, bend * 0.7),
    new THREE5.Vector3(x, y + h, z).addScaledVector(dir, bend)
  ], 14);
  const bark = coconut ? ["#9a8266", "#86705a"] : ["#8a6a4a", "#7a5a3c"];
  const r0 = 0.24 * s, r1 = 0.16 * s;
  g.leafy = false;
  for (let i = 0; i < spine.length - 1; i++) {
    const f = i / (spine.length - 1), r = r0 + (r1 - r0) * f;
    stem(g, spine[i], spine[i + 1], r * 1.06, r, bark[i % 2]);
    stem(g, spine[i], spine[i].clone().lerp(spine[i + 1], 0.18), r * 1.14, r * 1.1, bark[(i + 1) % 2]);
  }
  stem(g, new THREE5.Vector3(x, y - 0.2, z), new THREE5.Vector3(x, y + 0.5 * s, z), r0 * 1.7, r0 * 1.08, bark[0]);
  const top = spine[spine.length - 1];
  sphere(g, r1 * 1.8, coconut ? "#7a6a3a" : "#8a6a3a", top.x, top.y, top.z, 7);
  g.leafy = true;
  const nF = coconut ? 14 + Math.floor(rng() * 5) : 18 + Math.floor(rng() * 7);
  const leaf = coconut ? "#4f9a46" : "#6a9a4a";
  for (let k = 0; k < nF; k++) {
    const a = k * 2.39996 + rng() * 0.3, up = 0.55 - rng() * 0.9 - k / nF * 0.15;
    const out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a));
    const L2 = (coconut ? 4.2 : 3.8) * s * (0.8 + rng() * 0.35);
    const pts = curve([
      top.clone(),
      top.clone().addScaledVector(out, L2 * 0.35).add(new THREE5.Vector3(0, L2 * (0.25 + up * 0.35), 0)),
      top.clone().addScaledVector(out, L2 * 0.75).add(new THREE5.Vector3(0, L2 * (0.1 + up * 0.3), 0)),
      top.clone().addScaledVector(out, L2).add(new THREE5.Vector3(0, L2 * (-0.25 + up * 0.25), 0))
    ], 6);
    g.leafy = false;
    for (let i = 0; i < pts.length - 1; i++) stem(g, pts[i], pts[i + 1], 0.05 * s * (1 - i / 7), 0.04 * s * (1 - i / 7), "#8a8a4a", 4);
    g.leafy = true;
    const c = jitter(leaf, rng);
    for (let i = 1; i < pts.length; i++) {
      const t = new THREE5.Vector3().subVectors(pts[i], pts[i - 1]).normalize();
      const side = new THREE5.Vector3().crossVectors(t, UP).normalize();
      const n = new THREE5.Vector3().crossVectors(side, t).normalize();
      const size = L2 * 0.3 * (1 - i / pts.length * 0.45);
      cardAlong(g, pts[i - 1].clone().lerp(pts[i], 0.5), n, t, size, c, LeafKind.Frond, 0.6 + i / pts.length * 0.4);
    }
  }
  if (!coconut) for (let k = 0; k < 7; k++) {
    const a = k * 0.9 + rng(), out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a));
    const p = top.clone().addScaledVector(out, 0.5 * s).add(new THREE5.Vector3(0, -0.9 * s, 0));
    cardAlong(g, p, out.clone().multiplyScalar(-1).add(new THREE5.Vector3(0, 0.2, 0)).normalize(), new THREE5.Vector3(0, -1, 0).addScaledVector(out, 0.4).normalize(), 1.6 * s, "#a88a52", LeafKind.Frond, 0.3);
  }
  for (let k = 0; k < (coconut ? 5 : 4); k++) {
    const a = k * 1.7 + rng(), p = top.clone().add(new THREE5.Vector3(Math.cos(a) * 0.35 * s, -0.35 * s, Math.sin(a) * 0.35 * s));
    if (coconut) sphere(g, 0.2 * s, "#6a7a3a", p.x, p.y, p.z, 6);
    else for (let j = 0; j < 6; j++) sphere(g, 0.1 * s, j % 2 ? "#e08a2a" : "#c86a1a", p.x + (rng() - 0.5) * 0.3 * s, p.y - j * 0.12 * s, p.z + (rng() - 0.5) * 0.3 * s, 4);
  }
}
function conifer(g, x, y, z, s, rng, form, snow = false) {
  const h = (form === "cypress" ? 9 : form === "spruce" ? 8 : form === "fir" ? 8.6 : 9) * s * (0.85 + rng() * 0.3);
  const r0 = (form === "cypress" ? 0.18 : 0.26) * s;
  g.leafy = false;
  stem(g, new THREE5.Vector3(x, y - 0.2, z), new THREE5.Vector3(x, y + h * 0.55, z), r0 * 1.4, r0 * 0.8, "#6a4a32");
  stem(g, new THREE5.Vector3(x, y + h * 0.55, z), new THREE5.Vector3(x, y + h, z), r0 * 0.8, r0 * 0.15, form === "pine" ? "#b0683a" : "#6a4a32");
  const needle = form === "cypress" ? "#2f5a3a" : form === "spruce" ? "#2a5a3e" : form === "fir" ? "#2f6440" : "#3a6a42";
  const tiers = form === "cypress" ? 14 : form === "spruce" ? 11 : form === "fir" ? 12 : 7;
  const bottom = form === "spruce" ? 0.08 : form === "fir" ? 0.1 : form === "cypress" ? 0.1 : 0.4;
  for (let t = 0; t < tiers; t++) {
    const f = t / (tiers - 1), ty = y + h * (bottom + (1 - bottom) * f * 0.94);
    const R = form === "cypress" ? h * 0.13 * Math.sin(Math.min(1, f * 1.3 + 0.15) * Math.PI) * (1 - f * 0.4) : form === "spruce" ? h * 0.36 * (1 - f) + 0.3 * s : form === "fir" ? h * 0.31 * (1 - f) ** 1.1 + 0.25 * s : h * 0.3 * Math.sin((0.25 + f * 0.75) * Math.PI) * 0.9 + 0.3 * s;
    const n = form === "cypress" ? 5 : Math.max(4, Math.round(R * (form === "fir" ? 3 : 2.6)));
    const droop = form === "spruce" ? 0.35 : form === "fir" ? 0.16 : form === "pine" ? -0.1 : 0.05;
    for (let k = 0; k < n; k++) {
      const a = k / n * Math.PI * 2 + t * 0.7 + rng() * 0.4, out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a));
      const tip = new THREE5.Vector3(x, ty - R * droop, z).addScaledVector(out, R * (0.8 + rng() * 0.3));
      if (form !== "cypress") {
        g.leafy = false;
        stem(g, new THREE5.Vector3(x, ty, z), tip, 0.06 * s, 0.02 * s, "#5a3a26", 4);
      }
      g.leafy = true;
      const sprays = form === "cypress" ? 2 : 3;
      for (let j = 1; j <= sprays; j++) {
        const p = new THREE5.Vector3(x, ty, z).lerp(tip, j / sprays);
        const nrm = out.clone().multiplyScalar(form === "cypress" ? 1 : 0.55).add(new THREE5.Vector3(0, form === "cypress" ? 0.2 : 0.8, 0)).normalize();
        cardAlong(g, p, nrm, out, (form === "cypress" ? 1.3 : 1.6) * s * (1.1 - f * 0.4), jitter(needle, rng, 0.02, 0.12), LeafKind.Needles, 0.3 + f * 0.6);
      }
      if (snow && form === "spruce" && k % 2 === 0) {
        g.leafy = false;
        const p = new THREE5.Vector3(x, ty, z).lerp(tip, 0.6);
        sphere(g, R * 0.28 + 0.2 * s, "#f4f8ff", p.x, p.y + 0.18 * s, p.z, 6, 0.3);
      }
    }
  }
  g.leafy = true;
  cardAlong(g, new THREE5.Vector3(x, y + h, z), new THREE5.Vector3(0.3, 1, 0).normalize(), UP, 1.1 * s, jitter(needle, rng), LeafKind.Needles, 1);
}
function bamboo(g, x, y, z, s, rng) {
  const n = 9 + Math.floor(rng() * 10);
  for (let c = 0; c < n; c++) {
    const ox = (rng() - 0.5) * 1.8 * s, oz = (rng() - 0.5) * 1.8 * s, h = (6 + rng() * 5) * s;
    const a = Math.atan2(oz, ox) + (rng() - 0.5), arch = h * (0.12 + rng() * 0.15);
    const out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a));
    const pts = curve([
      new THREE5.Vector3(x + ox, y - 0.1, z + oz),
      new THREE5.Vector3(x + ox, y + h * 0.5, z + oz).addScaledVector(out, arch * 0.15),
      new THREE5.Vector3(x + ox, y + h * 0.85, z + oz).addScaledVector(out, arch * 0.55),
      new THREE5.Vector3(x + ox, y + h * 0.97, z + oz).addScaledVector(out, arch)
    ], 12);
    const r = (0.05 + rng() * 0.04) * s, green = rng() < 0.2 ? "#c8b85a" : "#6aa04a";
    g.leafy = false;
    for (let i = 0; i < pts.length - 1; i++) {
      stem(g, pts[i], pts[i + 1], r, r * 0.96, green, 6);
      stem(g, pts[i + 1].clone().lerp(pts[i], 0.05), pts[i + 1], r * 1.2, r * 1.15, "#5a8a3a", 6);
    }
    g.leafy = true;
    for (let i = Math.floor(pts.length * 0.45); i < pts.length; i++) {
      const t = new THREE5.Vector3().subVectors(pts[i], pts[i - 1]).normalize();
      for (const sd of [-1, 1]) {
        const side = new THREE5.Vector3().crossVectors(t, UP).normalize().multiplyScalar(sd);
        const nrm = side.clone().add(new THREE5.Vector3(0, 0.6, 0)).normalize();
        cardAlong(g, pts[i].clone().addScaledVector(side, 0.35 * s), nrm, side.clone().add(new THREE5.Vector3(0, -0.3, 0)).normalize(), 1.1 * s, jitter("#7ab85a", rng), LeafKind.Bamboo, 0.8);
      }
    }
  }
}
function banana(g, x, y, z, s, rng) {
  const h = (2.6 + rng() * 1.2) * s, top = new THREE5.Vector3(x, y + h, z);
  g.leafy = false;
  stem(g, new THREE5.Vector3(x, y - 0.1, z), top, 0.2 * s, 0.14 * s, "#8aa35a", 8);
  const n = 6 + Math.floor(rng() * 5);
  for (let k = 0; k < n; k++) {
    const a = k * 2.39996 + rng() * 0.4, out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a)), up = 0.9 - k / n * 1.1;
    const L2 = (2 + rng()) * s;
    const pts = curve([top.clone(), top.clone().addScaledVector(out, L2 * 0.4).add(new THREE5.Vector3(0, L2 * 0.35 * up + 0.3, 0)), top.clone().addScaledVector(out, L2).add(new THREE5.Vector3(0, L2 * 0.3 * up - 0.4 * s, 0))], 4);
    g.leafy = false;
    for (let i = 0; i < pts.length - 1; i++) stem(g, pts[i], pts[i + 1], 0.05 * s, 0.03 * s, "#7a9a4a", 4);
    g.leafy = true;
    for (let i = 1; i < pts.length; i++) {
      const t = new THREE5.Vector3().subVectors(pts[i], pts[i - 1]).normalize();
      const side = new THREE5.Vector3().crossVectors(t, UP).normalize(), nrm = new THREE5.Vector3().crossVectors(side, t).normalize();
      cardAlong(g, pts[i - 1].clone().lerp(pts[i], 0.5), nrm, t, L2 * 0.5, jitter("#5aa84a", rng), LeafKind.Banana, 0.7);
    }
  }
  g.leafy = false;
  const b = top.clone().add(new THREE5.Vector3(0.3 * s, -0.4 * s, 0));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
    const a = j / 4 * Math.PI * 2 + i;
    g.add(new THREE5.CylinderGeometry(0.03 * s, 0.05 * s, 0.35 * s, 5), "#8ab83a", M(b.x + Math.cos(a) * 0.14 * s, b.y - i * 0.18 * s, b.z + Math.sin(a) * 0.14 * s, 0, 1, 1, 1, Math.sin(a) * 0.5, -Math.cos(a) * 0.5));
  }
  sphere(g, 0.14 * s, "#7a2a5a", b.x, b.y - 1.1 * s, b.z, 7, 1.5);
  g.leafy = true;
}
function baobab(g, x, y, z, s, rng) {
  const h = (6 + rng() * 2) * s, R = (1.2 + rng() * 0.4) * s, seed = Math.floor(rng() * 999);
  const prof = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    prof.push(new THREE5.Vector2(R * (1.15 - 0.35 * t + 0.25 * Math.sin(t * Math.PI) - (t > 0.85 ? (t - 0.85) * 3 : 0)), t * h - 0.3));
  }
  const trunk = new THREE5.LatheGeometry(prof, 14);
  const pos = trunk.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i), py = pos.getY(i), pz = pos.getZ(i), k = 1 + fbm3(px * 0.5, py * 0.3, pz * 0.5, seed, 3) * 0.25;
    pos.setXYZ(i, px * k, py, pz * k);
  }
  trunk.computeVertexNormals();
  g.leafy = false;
  g.add(trunk, "#a8927a", M(x, y, z));
  const crownY = y + h - 0.3;
  const nB = 6 + Math.floor(rng() * 4);
  g.leafy = true;
  for (let k = 0; k < nB; k++) {
    const a = k / nB * Math.PI * 2 + rng() * 0.4, out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a));
    const p0 = new THREE5.Vector3(x, crownY, z).addScaledVector(out, R * 0.4);
    const p1 = p0.clone().addScaledVector(out, (1.5 + rng()) * s).add(new THREE5.Vector3(0, (0.8 + rng() * 0.8) * s, 0));
    const p2 = p1.clone().addScaledVector(out, 0.8 * s).add(new THREE5.Vector3((rng() - 0.5) * s, 0.5 * s, (rng() - 0.5) * s));
    g.leafy = false;
    stem(g, p0, p1, 0.3 * s, 0.16 * s, "#a0886e", 6);
    stem(g, p1, p2, 0.16 * s, 0.06 * s, "#a0886e", 5);
    g.leafy = true;
    for (let j = 0; j < 2; j++) cardAlong(g, p2.clone().add(new THREE5.Vector3((rng() - 0.5) * 0.6 * s, 0.2 * s, (rng() - 0.5) * 0.6 * s)), new THREE5.Vector3(out.x * 0.5, 1, out.z * 0.5).normalize(), out, 1.2 * s, jitter("#6a9a4a", rng), LeafKind.Small, 0.5);
  }
}
function crystalFruitTree(g, x, y, z, s, rng) {
  const h = (4.5 + rng() * 1.5) * s, top = new THREE5.Vector3(x, y + h * 0.55, z);
  g.leafy = false;
  stem(g, new THREE5.Vector3(x, y - 0.2, z), top, 0.22 * s, 0.14 * s, "#d8dcec");
  const gems = ["#9ae8ff", "#ffb8f0", "#fff08a", "#b8ffcc", "#c8b8ff"];
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * Math.PI * 2 + rng() * 0.5, out = new THREE5.Vector3(Math.cos(a), 0, Math.sin(a));
    const tip = top.clone().addScaledVector(out, (1.4 + rng() * 0.8) * s).add(new THREE5.Vector3(0, (1.2 + rng()) * s, 0));
    g.leafy = false;
    stem(g, top, tip, 0.1 * s, 0.04 * s, "#c8cce0", 5);
    g.leafy = true;
    for (let j = 0; j < 4; j++) {
      const p = tip.clone().add(new THREE5.Vector3((rng() - 0.5) * 1.2 * s, (rng() - 0.3) * 0.8 * s, (rng() - 0.5) * 1.2 * s));
      cardAlong(g, p, new THREE5.Vector3().subVectors(p, top).normalize(), UP, 1.3 * s, jitter("#c8e8ff", rng, 0.1, 0.1), LeafKind.Crystal, 0.6);
    }
    g.leafy = false;
    for (let j = 0; j < 2; j++) {
      const p = tip.clone().add(new THREE5.Vector3((rng() - 0.5) * s, -0.4 * s, (rng() - 0.5) * s));
      g.add(new THREE5.OctahedronGeometry(0.12 * s), gems[(k + j) % gems.length], M(p.x, p.y, p.z, rng() * 3, 1, 1.5, 1));
    }
  }
  g.leafy = true;
}

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/kit.ts
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/trees.ts
import * as THREE6 from "three";
import { mergeVertices as mergeVertices2 } from "three/addons/utils/BufferGeometryUtils.js";
var H = (o) => ({
  trunk: 0.3,
  r: 0.22,
  leader: false,
  tiers: 3,
  forks: 3,
  spread: 0.7,
  lift: 0.15,
  limb: 0.4,
  shrink: 0.7,
  depth: 2,
  blob: 0.17,
  squash: 0.85,
  gnarl: 0.15,
  card: LeafKind.Broad,
  ...o
});
var HABITS = {
  oak: H({ h: 5.6, trunk: 0.3, r: 0.3, forks: 4, spread: 0.8, lift: 0.1, limb: 0.42, shrink: 0.68, blob: 0.19, squash: 0.78, gnarl: 0.25, bark: "#6b5540", leaves: ["#4f8c42", "#5c9c4a", "#467f3c"] }),
  plane: H({ h: 7.2, trunk: 0.36, r: 0.27, leader: true, tiers: 4, forks: 3, spread: 0.95, lift: 0.35, limb: 0.3, shrink: 0.62, blob: 0.15, squash: 0.9, bark: "#b3a98c", marks: "#8a9876", leaves: ["#6aa84f", "#5d9a46", "#77b55a"] }),
  birch: H({ h: 7, trunk: 0.28, r: 0.15, leader: true, tiers: 5, forks: 3, spread: 0.7, lift: 0.5, limb: 0.2, shrink: 0.6, depth: 1, blob: 0.11, squash: 1.3, bark: "#ece8de", marks: "#2a2a2a", leaves: ["#9cc85a", "#b5d86a", "#8fbf52"], card: LeafKind.Small }),
  aspen: H({ h: 7.6, trunk: 0.34, r: 0.14, leader: true, tiers: 5, forks: 3, spread: 0.6, lift: 0.55, limb: 0.18, shrink: 0.6, depth: 1, blob: 0.1, squash: 1.45, bark: "#efeae0", marks: "#3a3a3a", leaves: ["#ffd84a", "#f2b830", "#ffe27a"], card: LeafKind.Small }),
  maple: H({ h: 5.8, trunk: 0.26, r: 0.24, forks: 3, spread: 0.55, lift: 0.25, limb: 0.42, shrink: 0.72, blob: 0.2, squash: 0.95, bark: "#6b5a4a", leaves: ["#e4572e", "#f29e4c", "#d1495b"] }),
  sakura: H({ h: 4.6, trunk: 0.24, r: 0.23, forks: 5, spread: 1.05, lift: 0.05, limb: 0.5, shrink: 0.66, blob: 0.17, squash: 0.6, gnarl: 0.3, bark: "#5a4038", leaves: ["#ffc4dc", "#ffb0cf", "#ffd6e6"], card: LeafKind.Blossom }),
  olive: H({ h: 3.9, trunk: 0.3, r: 0.26, forks: 4, spread: 0.8, lift: 0.2, limb: 0.42, shrink: 0.7, blob: 0.19, squash: 0.75, gnarl: 0.65, bark: "#7a705e", leaves: ["#8a9a5b", "#9aab6a", "#a4b07a"], card: LeafKind.Small }),
  orange: H({ h: 3.5, trunk: 0.22, r: 0.15, forks: 4, spread: 0.6, lift: 0.25, limb: 0.34, shrink: 0.66, blob: 0.22, squash: 0.9, bark: "#6b5a44", leaves: ["#3f8a3a", "#4a9a44"], flowers: ["#ff9a1f"] }),
  magnolia: H({ h: 5, trunk: 0.2, r: 0.2, forks: 5, spread: 0.8, lift: 0.2, limb: 0.42, shrink: 0.68, blob: 0.16, squash: 0.85, bark: "#6b5a4a", leaves: ["#5a8a4a", "#679a52"], flowers: ["#ffd6e6", "#ffffff", "#ffc0d8"] }),
  jacaranda: H({ h: 5.8, trunk: 0.3, r: 0.21, forks: 4, spread: 0.5, lift: 0.02, limb: 0.46, shrink: 0.78, blob: 0.17, squash: 0.58, bark: "#6b5040", leaves: ["#9a7ae0", "#b08aef", "#8a6ad6"], card: LeafKind.Blossom }),
  flame: H({ h: 5.2, trunk: 0.36, r: 0.25, forks: 5, spread: 1.15, lift: 0.04, limb: 0.46, shrink: 0.7, blob: 0.16, squash: 0.46, bark: "#6b5040", leaves: ["#3f8a3a", "#4a9a44"], flowers: ["#ff4a1f", "#ff9a1f", "#ff6a2a"] }),
  ginkgo: H({ h: 6.6, trunk: 0.3, r: 0.2, leader: true, tiers: 4, forks: 3, spread: 0.9, lift: 0.3, limb: 0.28, shrink: 0.6, blob: 0.14, squash: 1, bark: "#7a6a52", leaves: ["#f2c230", "#ffd84a", "#e8b422"], card: LeafKind.Small }),
  willow: H({ curtain: true, h: 5.8, trunk: 0.3, r: 0.31, forks: 5, spread: 0.72, lift: -0.12, limb: 0.42, shrink: 0.7, blob: 0.14, squash: 1.9, weep: true, bark: "#6b5a44", leaves: ["#9cc56a", "#a8d078", "#8ab85c"], card: LeafKind.Small }),
  rainbowgum: H({ h: 9.5, trunk: 0.55, r: 0.34, leader: true, tiers: 3, forks: 3, spread: 0.8, lift: 0.3, limb: 0.24, shrink: 0.6, blob: 0.12, squash: 0.8, bark: "#5aa05a", leaves: ["#4f9a4a", "#62ae52"], card: LeafKind.Small, bands: ["#5aa05a", "#ff9a4a", "#4a7ad0", "#9a3a5a", "#e8d05a"] }),
  dragonblood: H({ h: 4.8, trunk: 0.44, r: 0.24, forks: 3, spread: 0.5, lift: 0.1, limb: 0.26, shrink: 0.8, depth: 3, blob: 0.13, squash: 0.36, bark: "#8a7a6a", leaves: ["#3f6a3a", "#4a7a42"], card: LeafKind.Needles }),
  // The Sky Isles: cloud willows trailing pale foliage, candy-blossom trees, glow trees.
  cloud: H({ classic: true, h: 6.2, trunk: 0.32, r: 0.22, forks: 5, spread: 0.8, lift: -0.1, limb: 0.42, shrink: 0.7, blob: 0.15, squash: 1.8, gnarl: 0.4, weep: true, bark: "#e8e4f4", leaves: ["#f4f4ff", "#e8f0ff", "#fff4fa"], card: LeafKind.Small }),
  candy: H({ classic: true, h: 5, trunk: 0.26, r: 0.22, forks: 5, spread: 1, lift: 0.08, limb: 0.46, shrink: 0.68, blob: 0.18, squash: 0.7, gnarl: 0.3, bark: "#e8d0e8", leaves: ["#ffb8d8", "#b8d8ff", "#d8b8ff", "#fff0a8", "#b8ffd8"], card: LeafKind.Blossom }),
  glowtree: H({ classic: true, h: 5.6, trunk: 0.3, r: 0.2, leader: true, tiers: 4, forks: 3, spread: 0.85, lift: 0.2, limb: 0.34, shrink: 0.62, blob: 0.16, squash: 0.8, bark: "#4a4a6a", leaves: ["#7affd0", "#9ad8ff", "#c8a8ff"], card: LeafKind.Crystal }),
  wisteria: H({ curtain: true, h: 4.6, trunk: 0.34, r: 0.2, forks: 4, spread: 0.9, lift: -0.05, limb: 0.4, shrink: 0.7, blob: 0.16, squash: 1.1, gnarl: 0.7, weep: true, bark: "#6b5040", leaves: ["#b58ae0", "#d9b8ff", "#a47ad6", "#c9a2f2"], canopy: ["#6fa04a", "#7cae56"], card: LeafKind.Blossom })
};
var UP2 = new THREE6.Vector3(0, 1, 0);
var tmpQ = new THREE6.Quaternion();
var tmpM = new THREE6.Matrix4();
var ONE2 = new THREE6.Vector3(1, 1, 1);
function wood(g, p0, p1, r0, r1, col2) {
  const d = new THREE6.Vector3().subVectors(p1, p0), L2 = d.length();
  if (L2 < 1e-3) return;
  d.divideScalar(L2);
  const start = p0.clone().addScaledVector(d, -r0 * 0.6);
  const geo = new THREE6.CylinderGeometry(r1, r0, L2 + r0 * 0.6, 5, 1, true);
  geo.translate(0, (L2 + r0 * 0.6) / 2, 0);
  g.add(geo, col2, tmpM.compose(start, tmpQ.setFromUnitVectors(UP2, d), ONE2).clone());
}
function deviate(dir, angle, az) {
  const side = Math.abs(dir.y) > 0.95 ? new THREE6.Vector3(1, 0, 0) : UP2;
  const a = new THREE6.Vector3().crossVectors(dir, side).normalize();
  const b = new THREE6.Vector3().crossVectors(dir, a).normalize();
  const perp = a.multiplyScalar(Math.cos(az)).addScaledVector(b, Math.sin(az));
  return dir.clone().multiplyScalar(Math.cos(angle)).addScaledVector(perp, Math.sin(angle)).normalize();
}
function growTree(g, hb, x, y, z, s, rng) {
  const h = hb.h * s, base = new THREE6.Vector3(x, y, z);
  const bark = (i) => hb.bands ? hb.bands[i % hb.bands.length] : hb.bark;
  const tips = [];
  const branch = (p0, dir, len, r02, level) => {
    const mid = p0.clone().addScaledVector(dir, len * 0.5);
    const d2 = dir.clone().addScaledVector(UP2, hb.lift).addScaledVector(new THREE6.Vector3(rng() - 0.5, (rng() - 0.5) * 0.4, rng() - 0.5), hb.gnarl * 0.6).normalize();
    const end = mid.clone().addScaledVector(d2, len * 0.5);
    const rMid = r02 * 0.8, rEnd = r02 * 0.62;
    if (level >= hb.depth) wood(g, p0, end, r02, rEnd, bark(level));
    else {
      wood(g, p0, mid, r02, rMid, bark(level));
      wood(g, mid, end, rMid, rEnd, bark(level + 1));
    }
    if (level >= hb.depth) {
      tips.push({ p: end, r: hb.blob * h * (0.85 + rng() * 0.35) });
      return;
    }
    const n = hb.forks + (rng() < 0.3 ? 1 : 0) - (level > 1 ? 1 : 0);
    const az0 = rng() * Math.PI * 2, first = tips.length;
    for (let i = 0; i < n; i++) {
      const cd = deviate(d2, hb.spread * (0.75 + rng() * 0.5), az0 + i / n * Math.PI * 2 + (rng() - 0.5) * 0.6);
      branch(end, cd, len * hb.shrink * (0.85 + rng() * 0.3), rEnd * 0.78, level + 1);
    }
    if (level === hb.depth - 1) mergeTips(first);
  };
  const mergeTips = (first) => {
    const group = tips.splice(first);
    if (!group.length) return;
    const cen = new THREE6.Vector3();
    for (const t of group) cen.add(t.p);
    cen.divideScalar(group.length);
    let reach = 0, rr = 0;
    for (const t of group) {
      reach = Math.max(reach, t.p.distanceTo(cen));
      rr += t.r;
    }
    tips.push({ p: cen, r: reach * 0.85 + rr / group.length * 0.9 });
  };
  const r0 = hb.r * s;
  const lean = new THREE6.Vector3((rng() - 0.5) * 0.12, 1, (rng() - 0.5) * 0.12).normalize();
  if (hb.leader) {
    let p = base.clone(), r = r0;
    const top = base.clone().addScaledVector(lean, h * 0.92);
    const bare = h * hb.trunk;
    const firstNode = base.clone().addScaledVector(lean, bare);
    wood(g, p, firstNode, r, r * 0.8, bark(0));
    p = firstNode;
    r *= 0.8;
    const step = (top.y - firstNode.y) / hb.tiers;
    for (let t = 0; t < hb.tiers; t++) {
      const next = p.clone().addScaledVector(lean, step).add(new THREE6.Vector3((rng() - 0.5) * 0.2 * s, 0, (rng() - 0.5) * 0.2 * s));
      wood(g, p, next, r, r * 0.78, bark(t + 1));
      const k = 1 - t / hb.tiers, first = tips.length;
      for (let i = 0; i < hb.forks; i++) {
        const dir = deviate(lean, hb.spread * (0.85 + rng() * 0.3), i / hb.forks * Math.PI * 2 + t * 1.1 + rng() * 0.5);
        branch(p.clone().lerp(next, 0.4), dir, h * hb.limb * (0.55 + 0.45 * k), r * 0.5, 1);
      }
      if (hb.depth <= 1) mergeTips(first);
      p = next;
      r *= 0.78;
    }
    tips.push({ p: p.clone().addScaledVector(lean, h * 0.04), r: hb.blob * h * 0.9 });
  } else {
    const fork = base.clone().addScaledVector(lean, h * hb.trunk);
    wood(g, base, fork, r0, r0 * 0.78, bark(0));
    wood(g, base.clone().add(new THREE6.Vector3(0, -0.1 * s, 0)), base.clone().add(new THREE6.Vector3(0, 0.35 * s, 0)), r0 * 1.5, r0, bark(0));
    const az0 = rng() * Math.PI * 2;
    for (let i = 0; i < hb.forks; i++) {
      const dir = deviate(lean, hb.spread * (0.8 + rng() * 0.4), az0 + i / hb.forks * Math.PI * 2 + (rng() - 0.5) * 0.5);
      branch(fork, dir, h * hb.limb * (0.85 + rng() * 0.3), r0 * 0.62, 1);
    }
  }
  if (hb.bands) {
    const bare = h * hb.trunk, n = 11;
    for (let i = 0; i < n; i++) {
      const y0 = bare * rng() * 0.45, y1 = Math.min(bare, y0 + bare * (0.35 + rng() * 0.55));
      const rr0 = r0 * (1 - y0 / bare * 0.2) * 1.035, rr1 = r0 * (1 - y1 / bare * 0.2) * 1.035;
      const geo = new THREE6.CylinderGeometry(rr1, rr0, y1 - y0, 3, 1, true, i / n * Math.PI * 2 + rng() * 0.4, 0.5 + rng() * 0.5);
      geo.translate(0, (y0 + y1) / 2, 0);
      g.add(geo, hb.bands[1 + i % (hb.bands.length - 1)], tmpM.compose(base, tmpQ.setFromUnitVectors(UP2, lean), ONE2).clone());
    }
  }
  if (hb.marks) {
    for (let i = 1; i < 6; i++) {
      const k = i / 7, rr = r0 * (1 - k * 0.4);
      const geo = new THREE6.CylinderGeometry(rr * 1.03, rr * 1.04, h * 0.02, 6, 1, true);
      g.add(geo, hb.marks, tmpM.compose(base.clone().addScaledVector(lean, h * hb.trunk * k * 1.2), tmpQ.setFromUnitVectors(UP2, lean), ONE2).clone());
    }
  }
  const col2 = new THREE6.Color();
  for (const t of tips) {
    const leafCol = hb.leaves[Math.floor(rng() * hb.leaves.length)];
    const c = t.p.clone();
    if (hb.curtain) {
      curtainCrown(g, hb, c, t.r, leafCol, y, h, rng);
      continue;
    }
    if (!hb.classic) {
      openCrown(g, hb, c, t.r, leafCol, y, h, rng);
      continue;
    }
    if (hb.weep) c.y -= t.r * hb.squash * 0.55;
    const geo = clumpGeometry(Math.floor(rng() * CLUMPS));
    g.add(geo, col2.set(leafCol).multiplyScalar(0.86), tmpM.compose(c, tmpQ.setFromAxisAngle(UP2, rng() * Math.PI * 2), new THREE6.Vector3(t.r, t.r * hb.squash, t.r)).clone());
    leafCards(g, hb, c, t.r, leafCol, y, h, rng);
  }
}
function openCrown(g, hb, c, r, leafCol, baseY, h, rng) {
  const col2 = new THREE6.Color();
  const cen = hb.weep ? c.clone().add(new THREE6.Vector3(0, -r * hb.squash * 0.45, 0)) : c;
  const n = 3, a0 = rng() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const a = a0 + i / n * Math.PI * 2 + (rng() - 0.5) * 0.8;
    const rr = r * (0.52 + rng() * 0.18), off = r * (0.42 + rng() * 0.18);
    const p = cen.clone().add(new THREE6.Vector3(Math.cos(a) * off, (hb.weep ? -0.2 : 0.15 + rng() * 0.3) * r * hb.squash, Math.sin(a) * off));
    if (p.y - rr * hb.squash < baseY + 0.8) p.y = baseY + 0.8 + rr * hb.squash;
    const lc = hb.leaves[Math.floor(rng() * hb.leaves.length)];
    g.add(clumpGeometry(Math.floor(rng() * CLUMPS)), col2.set(lc).multiplyScalar(0.86), tmpM.compose(p, tmpQ.setFromAxisAngle(UP2, rng() * Math.PI * 2), new THREE6.Vector3(rr, rr * hb.squash, rr)).clone());
    leafCards(g, hb, p, rr, lc, baseY, h, rng, 1.12);
  }
}
var strandGeo = new THREE6.IcosahedronGeometry(1, 0);
function curtainCrown(g, hb, c, r, leafCol, baseY, h, rng) {
  const col2 = new THREE6.Color(leafCol);
  const top = hb.canopy ? hb.canopy[Math.floor(rng() * hb.canopy.length)] : leafCol;
  g.add(clumpGeometry(Math.floor(rng() * CLUMPS)), new THREE6.Color(top).multiplyScalar(0.86), tmpM.compose(c, tmpQ.setFromAxisAngle(UP2, rng() * Math.PI * 2), new THREE6.Vector3(r * 0.8, r * 0.45, r * 0.8)).clone());
  leafCards(g, { ...hb, squash: 0.45, weep: false, card: hb.canopy ? LeafKind.Small : hb.card, flowers: hb.canopy ? hb.leaves : hb.flowers }, c, r * 0.8, top, baseY, h, rng);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + rng() * 0.6, out = new THREE6.Vector3(Math.cos(a), 0, Math.sin(a));
    const rim = c.clone().addScaledVector(out, r * (0.6 + rng() * 0.25));
    const L2 = r * hb.squash * (0.9 + rng() * 0.7), bottom = Math.max(baseY + 0.7, rim.y - L2), len = rim.y - bottom;
    if (len < 0.4) continue;
    const sc = col2.clone().offsetHSL((rng() - 0.5) * 0.03, 0, (rng() - 0.5) * 0.1);
    g.add(strandGeo.clone(), sc.clone().multiplyScalar(0.86), tmpM.compose(new THREE6.Vector3(rim.x, rim.y - len / 2, rim.z), tmpQ.setFromAxisAngle(UP2, a), new THREE6.Vector3(r * 0.16, len / 2, r * 0.12)).clone());
    if (!g.cards) continue;
    const m = Math.max(2, Math.round(len / (r * 0.4)));
    for (let j = 0; j < m; j++) {
      const p = rim.clone().add(new THREE6.Vector3(0, -len * (j + 0.5) / m, 0)).addScaledVector(out, r * 0.08);
      const nrm = out.clone().add(new THREE6.Vector3(0, -0.15, 0)).normalize();
      g.card(p.x, p.y, p.z, nrm.x, nrm.y, nrm.z, Math.min(1.6, r * 0.42) * (0.8 + rng() * 0.4), sc, hb.card, 0.8 + j / m * 0.2, Math.PI / 2 + (rng() - 0.5) * 0.4, (rng() - 0.5) * 0.6);
    }
  }
}
var CLUMPS = 8;
var clumpCache = [];
function clumpGeometry(k) {
  if (!clumpCache[k]) {
    const base = new THREE6.IcosahedronGeometry(1, 1);
    base.deleteAttribute("normal");
    base.deleteAttribute("uv");
    const geo = mergeVertices2(base);
    base.dispose();
    const pos = geo.getAttribute("position"), v = new THREE6.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const d = 1 + fbm3(v.x * 1.6, v.y * 1.6, v.z * 1.6, 40 + k, 3) * 0.55 + fbm3(v.x * 3.4, v.y * 3.4, v.z * 3.4, 60 + k, 2) * 0.22;
      v.multiplyScalar(d);
      if (v.y < -0.55) v.y = -0.55 + (v.y + 0.55) * 0.5;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    clumpCache[k] = geo;
  }
  return clumpCache[k].clone();
}
function leafCards(g, hb, c, r, leafCol, baseY, h, rng, proud = 1) {
  if (!g.cards) return;
  const size = Math.min(3, Math.max(0.6, r * 0.62));
  const n = Math.max(14, Math.min(52, Math.round(4 * Math.PI * r * r * (0.6 + hb.squash * 0.4) / (size * size * 0.38))));
  const base = new THREE6.Color(leafCol), hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const hueSpread = hsl.s > 0.35 && !(hsl.h > 0.2 && hsl.h < 0.42) ? 0.07 : 0.03;
  const col2 = new THREE6.Color();
  const k = Math.min(1, Math.max(0, (c.y - baseY - h * 0.3) / (h * 0.7)));
  const sway = k * k;
  for (let i = 0; i < n; i++) {
    const yk = 1 - 2 * (i + 0.5) / n;
    if (yk < -0.8 && !hb.weep) continue;
    const rk = Math.sqrt(1 - yk * yk), ph = i * 2.39996 + rng() * 0.8;
    const dx = Math.cos(ph) * rk, dz = Math.sin(ph) * rk;
    const out = (0.88 + rng() * 0.24) * proud;
    const px = c.x + dx * r * out, py = c.y + yk * r * hb.squash * out, pz = c.z + dz * r * out;
    const nx = dx / r, ny = yk / (r * hb.squash), nz = dz / r, nl = Math.hypot(nx, ny, nz);
    const flower = hb.flowers && rng() < 0.35;
    col2.set(flower ? hb.flowers[Math.floor(rng() * hb.flowers.length)] : leafCol).offsetHSL((rng() - 0.5) * hueSpread * 2, (rng() - 0.5) * 0.1, (rng() - 0.5) * 0.14);
    g.card(px, py, pz, nx / nl, ny / nl, nz / nl, size * (0.8 + rng() * 0.4), col2, flower ? LeafKind.Blossom : hb.card, sway, rng() * Math.PI * 2, (rng() - 0.5) * 1.1);
  }
}

// ../../../home/user/azim12086atmes-s/golden-thread/src/world/kit.ts
var GeoBuilder = class {
  parts = [];
  stack = [new THREE7.Matrix4()];
  tmpColor = new THREE7.Color();
  /** While true, parts added are foliage (except wood: cylinders), drawn as leaves by the shader. */
  leafy = false;
  /**
   * Leaf cards (pictures of leafy sprigs) laid over tree crowns, when this builder collects them
   * (set to [] to opt in; see foliage.ts). Flat: CARD_STRIDE numbers per card.
   */
  cards = null;
  /** What each colour is made of (surfaces.ts): parts in a listed colour get that surface. */
  surfaces = null;
  /** A surface for the next parts regardless of colour (null: look the colour up). */
  surface = null;
  /**
   * One leaf card at (x, y, z) in the current frame, facing outwards along (nx, ny, nz), `size`
   * across, rolled by `roll` and tilted by `tilt`; `kind` picks the picture (0 broad leaves,
   * 1 small leaves, 2 needles, 3 blossom); `sway` is how freely it moves in the wind.
   */
  card(x, y, z, nx, ny, nz, size, color, kind, sway, roll, tilt) {
    if (!this.cards) return;
    const p = new THREE7.Vector3(x, y, z).applyMatrix4(this.top);
    const n = new THREE7.Vector3(nx, ny, nz).transformDirection(this.top);
    const sc = new THREE7.Vector3().setFromMatrixScale(this.top).x;
    this.tmpColor.set(color);
    this.cards.push(p.x, p.y, p.z, n.x, n.y, n.z, size * sc, this.tmpColor.r, this.tmpColor.g, this.tmpColor.b, kind, sway, roll, tilt);
  }
  /** Build only the leafy parts (tree crowns) into their own mesh, leaving the rest for `build`. */
  buildLeaves(material) {
    const leaves = [], rest = [];
    for (const p of this.parts) (p.getAttribute("leaf").getX(0) > 0.5 ? leaves : rest).push(p);
    this.parts = rest;
    if (!leaves.length) return null;
    const merged = mergeGeometries(leaves, false);
    for (const p of leaves) p.dispose();
    if (!merged) return null;
    merged.computeBoundingSphere();
    return new THREE7.Mesh(merged, material);
  }
  get size() {
    return this.parts.length;
  }
  /** Run `fn` with an extra local transform applied to everything it adds. */
  frame(x, y, z, ry = 0, s = 1, fn) {
    const m = new THREE7.Matrix4().compose(
      new THREE7.Vector3(x, y, z),
      new THREE7.Quaternion().setFromEuler(new THREE7.Euler(0, ry, 0)),
      new THREE7.Vector3(s, s, s)
    );
    this.stack.push(this.top.clone().multiply(m));
    try {
      fn();
    } finally {
      this.stack.pop();
    }
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  /** Run `fn` drawing in another builder's frame (`top`), so pieces in several builders line up exactly. */
  withTop(top, fn) {
    this.stack.push(top.clone());
    try {
      fn();
    } finally {
      this.stack.pop();
    }
  }
  add(geo, color, local) {
    const leaf = this.leafy && geo.type !== "CylinderGeometry" ? 1 : 0;
    let g = geo.index ? geo.toNonIndexed() : geo;
    if (g !== geo) geo.dispose();
    g.deleteAttribute("uv");
    g.deleteAttribute("uv1");
    if (!g.getAttribute("normal")) g.computeVertexNormals();
    const m = local ? this.top.clone().multiply(local) : this.top;
    g.applyMatrix4(m);
    this.tmpColor.set(color);
    const n = g.getAttribute("position").count;
    const cols = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      cols[i * 3] = this.tmpColor.r;
      cols[i * 3 + 1] = this.tmpColor.g;
      cols[i * 3 + 2] = this.tmpColor.b;
    }
    g.setAttribute("color", new THREE7.BufferAttribute(cols, 3));
    g.setAttribute("sway", new THREE7.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("leaf", new THREE7.BufferAttribute(new Float32Array(n).fill(leaf), 1));
    const surf = leaf ? 0 : this.surface ?? this.surfaces?.get("#" + this.tmpColor.getHexString()) ?? 0;
    g.setAttribute("surf", new THREE7.BufferAttribute(new Float32Array(n).fill(surf), 1));
    this.parts.push(g);
    return this;
  }
  /**
   * Like `add`, but coloured from `bottom` at the part's lowest point to `top` at its highest (in
   * its own frame, before placing): a crystal cloudy at its root and clear at its tip, a flame.
   */
  addGradient(geo, bottom, top, local) {
    const src = geo.index ? geo.toNonIndexed() : geo.clone();
    const pos = src.getAttribute("position");
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      lo = Math.min(lo, pos.getY(i));
      hi = Math.max(hi, pos.getY(i));
    }
    const ts = Array.from({ length: pos.count }, (_, i) => (pos.getY(i) - lo) / Math.max(hi - lo, 1e-6));
    this.add(src, bottom, local);
    const g = this.parts[this.parts.length - 1], cols = g.getAttribute("color");
    const a = new THREE7.Color(bottom), b = new THREE7.Color(top), c = new THREE7.Color();
    for (let i = 0; i < cols.count; i++) {
      c.copy(a).lerp(b, ts[i]);
      cols.setXYZ(i, c.r, c.g, c.b);
    }
    return this;
  }
  /** Take back everything added since `m` (a trial placement that did not fit). */
  rollback(m) {
    for (let p = m.start; p < this.parts.length; p++) this.parts[p].dispose();
    this.parts.length = m.start;
    if (this.cards && m.cards !== void 0) this.cards.length = m.cards;
  }
  /** Where the next parts start, and the transform they will be placed with (for `sway`). */
  mark() {
    return { start: this.parts.length, top: this.top.clone(), cards: this.cards?.length };
  }
  /**
   * Let everything added since `m` move in the wind: nothing at the base, fully free at the top.
   * `baseY` and `height` are in the local frame the parts were added in.
   */
  sway(m, baseY, height, max = 1) {
    const v = new THREE7.Vector3(0, baseY, 0).applyMatrix4(m.top);
    const sy = new THREE7.Vector3().setFromMatrixScale(m.top).y;
    const y0 = v.y + height * sy * 0.3, y1 = v.y + height * sy;
    for (let p = m.start; p < this.parts.length; p++) {
      const pos = this.parts[p].getAttribute("position"), w = this.parts[p].getAttribute("sway");
      for (let i = 0; i < pos.count; i++) {
        const k = Math.min(1, Math.max(0, (pos.getY(i) - y0) / Math.max(1e-3, y1 - y0)));
        w.setX(i, k * k * max);
      }
    }
  }
  build(material) {
    if (!this.parts.length) return null;
    const merged = mergeGeometries(this.parts, false);
    for (const p of this.parts) p.dispose();
    this.parts = [];
    if (!merged) return null;
    merged.computeBoundingSphere();
    return new THREE7.Mesh(merged, material);
  }
};
var M = (x = 0, y = 0, z = 0, ry = 0, sx = 1, sy = 1, sz = 1, rx = 0, rz = 0) => new THREE7.Matrix4().compose(
  new THREE7.Vector3(x, y, z),
  new THREE7.Quaternion().setFromEuler(new THREE7.Euler(rx, ry, rz)),
  new THREE7.Vector3(sx, sy, sz)
);
function cyl(g, rTop, rBot, h, c, x = 0, y = 0, z = 0, seg = 8) {
  const geo = new THREE7.CylinderGeometry(rTop, rBot, h, seg);
  geo.translate(0, h / 2, 0);
  g.add(geo, c, M(x, y, z));
}
function cone(g, r, h, c, x = 0, y = 0, z = 0, seg = 8, ry = 0) {
  const geo = new THREE7.ConeGeometry(r, h, seg);
  geo.translate(0, h / 2, 0);
  g.add(geo, c, M(x, y, z, ry));
}
function sphere(g, r, c, x = 0, y = 0, z = 0, seg = 8, sy = 1) {
  const geo = new THREE7.SphereGeometry(r, seg, Math.max(4, seg * 0.6));
  g.add(geo, c, M(x, y, z, 0, 1, sy, 1));
}
var BARK = {
  oak: SURF.barkFurrowed,
  maple: SURF.barkFurrowed,
  olive: SURF.barkFurrowed,
  willow: SURF.barkFurrowed,
  jacaranda: SURF.barkFurrowed,
  ginkgo: SURF.barkFurrowed,
  wisteria: SURF.barkFurrowed,
  pine: SURF.barkFurrowed,
  fir: SURF.barkFurrowed,
  snowpine: SURF.barkFurrowed,
  cypress: SURF.barkFurrowed,
  plane: SURF.barkPlates,
  birch: SURF.barkLenticel,
  aspen: SURF.barkLenticel,
  sakura: SURF.barkLenticel,
  orange: SURF.barkSmooth,
  magnolia: SURF.barkSmooth,
  flame: SURF.barkSmooth,
  rainbowgum: SURF.barkSmooth,
  dragonblood: SURF.barkSmooth,
  banana: SURF.barkSmooth,
  baobab: SURF.barkSmooth,
  bamboo: SURF.barkSmooth,
  palm: SURF.barkRinged,
  coconut: SURF.barkRinged
};
function tree(g, kind, x, y, z, s, rng) {
  const m = g.mark();
  g.leafy = true;
  const habit = HABITS[kind];
  const was = g.surface;
  g.surface = BARK[kind] ?? null;
  try {
    if (habit) growTree(g, habit, x, y, z, s, rng);
    else if (kind === "palm" || kind === "coconut") palm(g, x, y, z, s, rng, kind === "coconut");
    else if (kind === "pine") conifer(g, x, y, z, s, rng, "pine");
    else if (kind === "snowpine") conifer(g, x, y, z, s, rng, "spruce", true);
    else if (kind === "fir") conifer(g, x, y, z, s, rng, "fir");
    else if (kind === "cypress") conifer(g, x, y, z, s, rng, "cypress");
    else if (kind === "bamboo") bamboo(g, x, y, z, s, rng);
    else if (kind === "banana") banana(g, x, y, z, s, rng);
    else if (kind === "baobab") baobab(g, x, y, z, s, rng);
    else if (kind === "crystal") crystalFruitTree(g, x, y, z, s, rng);
    else treeParts(g, kind, x, y, z, s, rng);
  } finally {
    g.leafy = false;
    g.surface = was;
  }
  const tall = habit ? habit.h : kind === "palm" || kind === "coconut" || kind === "bamboo" ? 6 : 4.5;
  g.sway(m, y, tall * s, kind === "bamboo" || kind === "willow" || kind === "palm" || kind === "coconut" ? 1.3 : 1);
}
function treeParts(g, kind, x, y, z, s, rng) {
  const trunk = "#7a5a3c";
  const v = rng();
  switch (kind) {
    case "pine":
    case "snowpine": {
      cyl(g, 0.18 * s, 0.25 * s, 1.2 * s, trunk, x, y, z, 5);
      const col2 = v > 0.5 ? "#2f6b4a" : "#3b7d55";
      for (let i = 0; i < 3; i++) {
        cone(g, (1.6 - i * 0.4) * s, 1.8 * s, col2, x, y + (1 + i * 1.1) * s, z, 7);
        if (kind === "snowpine") cone(g, (0.8 - i * 0.2) * s, 0.8 * s, "#f4f8ff", x, y + (2 + i * 1.1) * s, z, 7);
      }
      break;
    }
    case "cypress":
      cyl(g, 0.12 * s, 0.18 * s, 0.8 * s, trunk, x, y, z, 5);
      sphere(g, 0.7 * s, "#44805a", x, y + 3 * s, z, 7, 3.4);
      break;
    case "palm":
    case "coconut": {
      const h = 5 * s;
      cyl(g, 0.14 * s, 0.24 * s, h, "#9b7a52", x, y, z, 6);
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2 + v;
        const geo = new THREE7.ConeGeometry(0.35 * s, 2.6 * s, 3);
        geo.translate(0, 1.3 * s, 0);
        g.add(geo, i % 2 ? "#3f9a4a" : "#52b25a", M(x, y + h, z, a, 1, 1, 1, 0, 1.9));
      }
      if (kind === "coconut") sphere(g, 0.35 * s, "#6b4a2a", x, y + h - 0.3 * s, z, 5);
      break;
    }
    case "bamboo":
      for (let i = 0; i < 5; i++) {
        const ox = (rng() - 0.5) * 1.4 * s, oz = (rng() - 0.5) * 1.4 * s;
        const h = (4 + rng() * 3) * s;
        cyl(g, 0.08 * s, 0.1 * s, h, "#7fb35a", x + ox, y, z + oz, 5);
        sphere(g, 0.6 * s, "#8ccf62", x + ox, y + h, z + oz, 5, 1.6);
      }
      break;
    case "willow":
      cyl(g, 0.25 * s, 0.35 * s, 2.6 * s, trunk, x, y, z, 6);
      cone(g, 2.4 * s, 3.6 * s, "#9cc56a", x, y + 0.8 * s, z, 9);
      break;
    case "crystal":
      for (let i = 0; i < 3; i++) cone(g, 0.4 * s, (2 + i) * s, i % 2 ? "#b8e8ff" : "#d8c8ff", x + i * 0.5 * s - 0.5 * s, y, z + i % 2 * 0.4 * s, 5);
      break;
    case "banana":
      cyl(g, 0.15 * s, 0.2 * s, 2.2 * s, "#8aa35a", x, y, z, 6);
      for (let i = 0; i < 5; i++) {
        const geo = new THREE7.BoxGeometry(0.5 * s, 0.05 * s, 2 * s);
        geo.translate(0, 0, 1 * s);
        g.add(geo, "#4fa04a", M(x, y + 2.2 * s, z, i / 5 * Math.PI * 2, 1, 1, 1, -0.5, 0));
      }
      break;
    case "wisteria": {
      trunkWithBark(g, 0.2 * s, 0.32 * s, 2.4 * s, "#6b5040", x, y, z);
      sphere(g, 1.6 * s, "#6fa04a", x, y + 3 * s, z, 7, 0.7);
      for (let i = 0; i < 14; i++) {
        const a = i / 14 * Math.PI * 2 + v, r = (0.6 + i % 3 * 0.4) * s;
        cone(g, 0.22 * s, (0.9 + i % 4 * 0.25) * s, i % 3 ? "#b58ae0" : "#d9b8ff", x + Math.cos(a) * r, y + 2.1 * s, z + Math.sin(a) * r, 5);
      }
      break;
    }
    case "ginkgo":
      trunkWithBark(g, 0.18 * s, 0.28 * s, 3 * s, "#7a6a52", x, y, z);
      for (let i = 0; i < 4; i++) cone(g, (1.4 - i * 0.25) * s, 1.4 * s, i % 2 ? "#f2c230" : "#ffd84a", x, y + (2.2 + i * 0.9) * s, z, 8);
      break;
    case "flame":
      trunkWithBark(g, 0.2 * s, 0.34 * s, 2.6 * s, "#6b5040", x, y, z);
      sphere(g, 2.4 * s, "#3f8a3a", x, y + 3.1 * s, z, 8, 0.45);
      for (let i = 0; i < 16; i++) {
        const a = i * 2.4 + v * 6, r = (0.4 + i * 7 % 10 / 5) * s;
        sphere(g, 0.42 * s, i % 3 ? "#ff4a1f" : "#ff9a1f", x + Math.cos(a) * r, y + 3.5 * s + i % 2 * 0.2 * s, z + Math.sin(a) * r, 5, 0.6);
      }
      break;
    case "jacaranda":
      trunkWithBark(g, 0.18 * s, 0.3 * s, 2.4 * s, "#6b5040", x, y, z);
      for (const [dx, dy, dz, r] of [[0, 3.2, 0, 1.7], [1.2, 2.8, 0.4, 1.2], [-1.1, 2.9, -0.5, 1.2], [0.2, 3.9, -0.6, 1]]) sphere(g, r * s, v > 0.5 ? "#9a7ae0" : "#b08aef", x + dx * s, y + dy * s, z + dz * s, 7, 0.8);
      break;
    case "rainbowgum": {
      const cols = ["#5aa05a", "#ff9a4a", "#4a7ad0", "#9a3a5a", "#e8d05a"];
      for (let i = 0; i < 6; i++) cyl(g, (0.34 - i * 0.03) * s, (0.36 - i * 0.03) * s, 0.9 * s, cols[(i + Math.floor(v * 5)) % 5], x, y + i * 0.9 * s, z, 7);
      sphere(g, 2 * s, "#4f9a4a", x, y + 6.2 * s, z, 7, 0.8);
      sphere(g, 1.4 * s, "#62ae52", x + 1.2 * s, y + 5.6 * s, z, 6, 0.8);
      break;
    }
    case "baobab":
      cyl(g, 0.7 * s, 1 * s, 3.2 * s, "#a88a6a", x, y, z, 9);
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2 + v;
        const geo = new THREE7.CylinderGeometry(0.08 * s, 0.16 * s, 1.4 * s, 5);
        geo.translate(0, 0.7 * s, 0);
        g.add(geo, "#9a7a5a", M(x, y + 3.1 * s, z, a, 1, 1, 1, 0.9, 0));
        sphere(g, 0.5 * s, "#6a9a4a", x + Math.cos(a) * 1.2 * s, y + 4.2 * s, z + Math.sin(a) * 1.2 * s, 5, 0.6);
      }
      break;
    case "dragonblood":
      cyl(g, 0.22 * s, 0.3 * s, 2.2 * s, "#8a7a6a", x, y, z, 6);
      for (let i = 0; i < 5; i++) {
        const geo = new THREE7.CylinderGeometry(0.07 * s, 0.1 * s, 1.2 * s, 4);
        geo.translate(0, 0.6 * s, 0);
        g.add(geo, "#8a7a6a", M(x, y + 2.2 * s, z, i / 5 * Math.PI * 2, 1, 1, 1, 0.6, 0));
      }
      sphere(g, 2.2 * s, "#3f6a3a", x, y + 3.3 * s, z, 9, 0.32);
      break;
    case "candy": {
      trunkWithBark(g, 0.14 * s, 0.22 * s, 2.2 * s, "#e8d0e8", x, y, z);
      const pastel = ["#ffb8d8", "#b8d8ff", "#d8b8ff", "#fff0a8", "#b8ffd8"];
      for (const [dx, dy, dz, r] of [[0, 3, 0, 1.4], [0.9, 2.6, 0.3, 1], [-0.8, 2.7, -0.4, 1], [0, 3.9, 0, 0.9]]) sphere(g, r * s, pastel[Math.floor((v * 5 + dx + dy) * 7) % 5], x + dx * s, y + dy * s, z + dz * s, 7);
      break;
    }
    case "glowtree":
      trunkWithBark(g, 0.14 * s, 0.24 * s, 2.6 * s, "#4a4a6a", x, y, z);
      for (let i = 0; i < 5; i++) cone(g, (1.3 - i * 0.2) * s, 1.2 * s, i % 2 ? "#7affd0" : "#9ad8ff", x, y + (2 + i * 0.75) * s, z, 7);
      break;
    case "magnolia":
      trunkWithBark(g, 0.16 * s, 0.26 * s, 2.2 * s, "#6b5a4a", x, y, z);
      sphere(g, 1.6 * s, "#5a8a4a", x, y + 3 * s, z, 7, 0.9);
      for (let i = 0; i < 18; i++) {
        const a = i * 2.4 + v * 6, e = i * 5 % 9 / 9;
        sphere(g, 0.24 * s, i % 3 ? "#ffd6e6" : "#ffffff", x + Math.cos(a) * 1.55 * s * Math.cos(e), y + 3 * s + Math.sin(e) * 1.4 * s, z + Math.sin(a) * 1.55 * s * Math.cos(e), 5, 0.7);
      }
      break;
    case "aspen":
      trunkWithBark(g, 0.1 * s, 0.16 * s, 3.4 * s, "#efeae0", x, y, z, "#3a3a3a");
      sphere(g, 1 * s, v > 0.5 ? "#ffd84a" : "#f2b830", x, y + 3.8 * s, z, 7, 1.6);
      break;
    default: {
      const leaf = {
        oak: ["#5c9c4a", "#6aab52", "#4f8c42"],
        birch: ["#9cc85a", "#b5d86a"],
        sakura: ["#ffc4dc", "#ffb0cf", "#ffd6e6"],
        maple: ["#e4572e", "#f29e4c", "#d1495b"],
        olive: ["#8a9a5b", "#9aab6a"],
        orange: ["#3f8a3a", "#4a9a44"],
        plane: ["#6aa84f", "#7cba5f"],
        cloud: ["#ffffff", "#f2f0ff"]
      };
      const cols = leaf[kind] ?? leaf.oak;
      const col2 = cols[Math.floor(v * cols.length)];
      trunkWithBark(g, 0.16 * s, 0.26 * s, 2 * s, kind === "birch" ? "#e8e4da" : trunk, x, y, z, kind === "birch" ? "#2a2a2a" : void 0);
      sphere(g, 1.5 * s, col2, x, y + 2.8 * s, z, 7);
      sphere(g, 0.9 * s, lighten(col2), x + 0.3 * s, y + 3.6 * s, z + 0.2 * s, 6);
      sphere(g, 1.1 * s, col2, x + 0.9 * s, y + 2.4 * s, z + 0.3 * s, 6);
      sphere(g, 1 * s, col2, x - 0.7 * s, y + 2.6 * s, z - 0.5 * s, 6);
      if (kind === "orange") for (let i = 0; i < 4; i++) sphere(g, 0.16 * s, "#ff9a1f", x + (rng() - 0.5) * 2 * s, y + (2.2 + rng()) * s, z + (rng() - 0.5) * 2 * s, 4);
    }
  }
}
function trunkWithBark(g, rTop, rBot, h, c, x, y, z, marks) {
  cyl(g, rTop, rBot, h, c, x, y, z, 6);
  cyl(g, rBot * 1.05, rBot * 1.6, h * 0.12, c, x, y, z, 6);
  const band = marks ?? "#" + new THREE7.Color(c).multiplyScalar(0.72).getHexString();
  for (let i = 1; i < 4; i++) {
    const k = i / 4, r = rBot + (rTop - rBot) * k;
    cyl(g, r * 1.04, r * 1.06, h * (marks ? 0.03 : 0.05), band, x, y + h * k, z, 6);
  }
}
var lighten = (c) => "#" + new THREE7.Color(c).lerp(new THREE7.Color("#fff6c8"), 0.28).getHexString();
export {
  CARD_STRIDE,
  FOLIAGE_UNIFORMS,
  GeoBuilder,
  HABITS,
  WIND_UNIFORMS,
  blobMaterial,
  cardMaterial,
  tree
};
