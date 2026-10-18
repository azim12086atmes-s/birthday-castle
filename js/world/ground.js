// The ground (world pass 2, Oct 17): one clean shader for the whole land, after studying how
// Arkenfall paints its terrain. It replaces three stacked patches (meadowGrade, rockGrade and the
// painted-ground block), the tiled grass texture and their constant lilac glow.
//
// The study thread's painted colour map (vertex colours) gives the biome: meadow, forest floor,
// sand, town ground, the baked great ridge. On top of it, in world space and with no texture
// repeats: meadow greens in sun-warm and cool patches, wildflower drifts (the same drifts the
// grass field blooms in, so near and far agree), bare earth on the banks, carved rock with strata,
// runnels and moss on the steep walls, snow on the heights, and a micro relief that bends the
// light so the ground reads as knolls and tussocks instead of a smooth sheet.
// At night: moss veins in the rock and the flower drifts breathe a soft bioluminescent light.
import * as THREE from 'three';
import { MOOD } from './sky.js';

export const GROUND_TIME = { value: 0 };

// noise shared with the grass field (meadow.js mirrors gHash/gNoise in JS for the flower drifts)
export const GROUND_NOISE = /* glsl */`
  float gHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float gNoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
    return mix(mix(gHash(i), gHash(i + vec2(1., 0.)), u.x), mix(gHash(i + vec2(0., 1.)), gHash(i + vec2(1., 1.)), u.x), u.y); }
  // drift field: where wildflowers gather (0..1) and which colour each drift is
  float flowerDrift(vec2 wp){ return smoothstep(0.56, 0.8, gNoise(wp * 0.014 + vec2(3.1, -7.4)) * 0.75 + gNoise(wp * 0.05) * 0.25); }
  vec3 driftColour(vec2 wp){
    // blends smoothly from drift to drift: white daisies, red poppies, blue cornflowers, gold, violet
    float a = gNoise(wp * 0.011 + 17.0), b = gNoise(wp * 0.013 - 9.0);
    vec3 c = mix(vec3(0.95, 0.95, 0.9), vec3(0.9, 0.2, 0.14), smoothstep(0.35, 0.65, a));
    c = mix(c, vec3(0.32, 0.45, 0.95), smoothstep(0.55, 0.8, b));
    return mix(c, vec3(1.0, 0.75, 0.2), smoothstep(0.62, 0.85, gNoise(wp * 0.009 + 40.0)) * 0.8);
  }
`;

// m: a MeshLambertMaterial with vertexColors (its earlier onBeforeCompile, if any, runs first)
export function groundGrade(m, key) {
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.uniforms.uGTime = GROUND_TIME;
    sh.uniforms.uGNight = MOOD.night;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGW; varying vec3 vGN;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvGW = (modelMatrix * vec4(transformed, 1.0)).xyz; vGN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uGTime, uGNight; varying vec3 vGW; varying vec3 vGN;
        ${GROUND_NOISE}
        float gCrag(vec2 p){ float a = 1.0 - abs(2.0 * gNoise(p * 0.011) - 1.0), b = 1.0 - abs(2.0 * gNoise(p * 0.037 + 5.0) - 1.0); return a * a * 0.7 + b * b * 0.3; }
        float gRelief(vec2 p){ return gNoise(p * 0.09) * 0.55 + gNoise(p * 0.31 + 4.0) * 0.3 + gNoise(p * 1.1 + 9.0) * 0.15; }
        vec3 gGlow = vec3(0.0);`)
      .replace('#include <color_fragment>', `#include <color_fragment>
      {
        vec3 P = diffuseColor.rgb;
        vec2 wp = vGW.xz; float y = vGW.y;
        float up = normalize(vGN).y;
        float camD = length(vGW - cameraPosition);
        float nearF = 1.0 - smoothstep(80.0, 450.0, camD);
        float n1 = gNoise(wp * 0.0035), n2 = gNoise(wp * 0.017 + 3.0), n3 = gNoise(wp * 0.08 + 7.0), n4 = gNoise(wp * 0.45 + 1.0);
        // the baked great ridge round the map keeps its own colour map
        float rg = smoothstep(9500.0, 11000.0, length(wp - vec2(-709.5, 2260.5)));
        // how much of the painted colour is meadow green
        float grassy = smoothstep(0.004, 0.05, P.g - max(P.r, P.b * 0.95)) * (1.0 - rg);
        // meadow: rich greens, warm sunlit patches and cool shaded ones, broken at three scales
        vec3 g = P * vec3(0.78, 1.0, 0.6);
        g *= mix(vec3(0.78, 0.95, 1.1), vec3(1.16, 1.08, 0.7), smoothstep(0.28, 0.78, n1));
        g *= 0.82 + 0.34 * n2;
        g *= mix(1.0, 0.86 + 0.28 * n3, nearF);
        g *= mix(1.0, 0.9 + 0.2 * n4, nearF * nearF);
        // the wind's cat's-paws: a lighter sheen rolling over the far meadows
        float gust = gNoise(wp * 0.012 + vec2(uGTime * 0.05, uGTime * 0.02));
        g += vec3(0.05, 0.07, 0.02) * smoothstep(0.55, 0.85, gust) * (1.0 - nearF * 0.7);
        // wildflower drifts read as a coloured wash beyond the grass field
        float dr = flowerDrift(wp);
        g = mix(g, driftColour(wp) * 0.7, dr * 0.28 * smoothstep(60.0, 160.0, camD));
        vec3 col = mix(P, g, grassy);
        // the lilac forest floor of the painted map reads as mossy leaf litter in the lowland woods
        float lilac = smoothstep(0.0, 0.06, min(P.b - P.g, P.r - P.g)) * (1.0 - rg) * (1.0 - smoothstep(250.0, 450.0, y));
        col = mix(col, vec3(0.2, 0.3, 0.13) * (0.75 + 0.5 * n2) + vec3(0.06, 0.03, 0.0) * n3, lilac * 0.75);
        // the pale sand of the painted map stays on the beaches: inland and up the banks it greens over
        float lumP = dot(P, vec3(0.3, 0.59, 0.11)), satP = max(P.r, max(P.g, P.b)) - min(P.r, min(P.g, P.b));
        float pale = smoothstep(0.5, 0.66, lumP) * (1.0 - smoothstep(0.12, 0.25, satP)) * smoothstep(5.0, 14.0, y) * (1.0 - smoothstep(600.0, 800.0, y)) * (1.0 - rg);
        vec3 mg = vec3(0.25, 0.45, 0.15) * mix(vec3(0.8, 0.95, 1.1), vec3(1.15, 1.08, 0.72), smoothstep(0.28, 0.78, n1)) * (0.82 + 0.34 * n2);
        col = mix(col, mg, pale * 0.85);
        // under the grass ring the ground takes the colour of the grass roots, so no pale earth shows between the blades
        col = mix(col, col * vec3(0.55, 0.68, 0.42), (1.0 - smoothstep(30.0, 150.0, camD)) * max(grassy, pale) * 0.85);
        // slow cloud shadows drifting over the land (the grass blades carry the same ones)
        col *= 0.62 + 0.38 * smoothstep(0.32, 0.62, gNoise(wp * 0.004 + vec2(uGTime * 0.012, uGTime * 0.005)));
        // bare earth on the banks between the flats
        float bank = smoothstep(0.9, 0.78, up + (n3 - 0.5) * 0.08) * grassy;
        vec3 earth = vec3(0.34, 0.25, 0.17) * (0.75 + 0.5 * n3);
        col = mix(col, earth, bank * 0.7);
        // carved rock on the steep walls
        float rn = n2 * 0.6 + n3 * 0.4;
        float steep = smoothstep(0.74, 0.56, up + (rn - 0.5) * 0.16) * smoothstep(6.0, 30.0, y);
        float strata = 0.9 + 0.1 * sin(y * 0.21 + rn * 8.0 + gNoise(wp * 0.006) * 10.0);
        float run = gNoise(vec2((wp.x - wp.y) * 0.05, y * 0.005)) * 0.6 + gNoise(vec2((wp.x + wp.y) * 0.19, y * 0.018)) * 0.4;
        float crev = smoothstep(0.6, 0.3, run);
        vec3 rock = mix(vec3(0.33, 0.3, 0.3), vec3(0.68, 0.62, 0.56), rn * rn) * strata * (1.0 - 0.5 * crev);
        // the lower mountainsides wear forest and alpine grass between the rock walls
        float alp = smoothstep(0.55, 0.72, up + (n2 - 0.5) * 0.2) * (1.0 - smoothstep(700.0, mix(1050.0, 1900.0, rg), y + (n1 - 0.5) * 300.0));
        rock = mix(rock, mix(vec3(0.13, 0.26, 0.12), vec3(0.3, 0.42, 0.16), n3) * (0.75 + 0.5 * n2), alp * 0.85);
        float moss = smoothstep(0.5, 0.78, up + gNoise(wp * 0.04) * 0.25 - 0.1) * (1.0 - smoothstep(900.0, 1100.0, y));
        rock = mix(rock, vec3(0.2, 0.33, 0.14) * (0.8 + 0.4 * n3), moss * 0.7);
        col = mix(col, rock, steep);
        // the flat tops of the high plateaus (palace mesa, satellites) are meadow, not bare grey stone
        float mesa = smoothstep(0.9, 0.97, up) * smoothstep(250.0, 320.0, y) * (1.0 - smoothstep(930.0, 990.0, y)) * (1.0 - rg);
        col = mix(col, vec3(0.3, 0.48, 0.2) * (0.8 + 0.4 * rn) * (0.9 + 0.2 * n3), mesa * 0.85);
        // snow on the heights
        // the great ridge round the world: its gentler slopes are alpine grass low down and bare stone higher up
        vec3 alpine = mix(vec3(0.2, 0.36, 0.14) * (0.8 + 0.4 * n2), vec3(0.42, 0.39, 0.38) * (0.8 + 0.4 * rn), smoothstep(700.0, 1700.0, y + (n1 - 0.5) * 500.0));
        col = mix(col, alpine, rg * (1.0 - steep) * 0.8);
        float snow = smoothstep(mix(1050.0, 2600.0, rg), mix(1300.0, 3000.0, rg), y + (rn - 0.5) * mix(200.0, 600.0, rg)) * smoothstep(0.42, 0.68, up);
        col = mix(col, vec3(0.95, 0.97, 1.02), snow);
        // moonlit land stays dim so the glow of the night (moss, drifts, fireflies, lanterns) carries
        diffuseColor.rgb = col * mix(1.0, 0.6, uGNight);
        // night: bioluminescent moss in the rock seams and a breath of light in the flower drifts
        float pulse = 0.65 + 0.35 * sin(uGTime * 1.6 + n2 * 12.0);
        gGlow = (vec3(0.1, 0.75, 0.85) * crev * moss * steep * 0.5 + driftColour(wp) * dr * grassy * 0.18 * nearF + vec3(0.25, 0.6, 0.45) * grassy * 0.03) * pulse * uGNight;
      }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec2 wp = vGW.xz; vec3 nW = normalize(vGN);
        float camD = length(vGW - cameraPosition);
        // micro relief: tussocks and knolls bend the light (world-space bump from the relief noise)
        float k = (1.0 - smoothstep(60.0, 400.0, camD)) * 1.4;
        if (k > 0.0) {
          float e = 0.6;
          float hx = gRelief(wp + vec2(e, 0.0)) - gRelief(wp - vec2(e, 0.0));
          float hz = gRelief(wp + vec2(0.0, e)) - gRelief(wp - vec2(0.0, e));
          nW = normalize(nW - vec3(hx, 0.0, hz) / (2.0 * e) * k);
        }
        // crags: on the mountain walls a ridged rock relief breaks the smooth slopes into buttresses,
        // gullies and ledges, at every distance (the step grows with distance so it never shimmers)
        float steepN = smoothstep(0.85, 0.55, nW.y) * smoothstep(20.0, 80.0, vGW.y);
        if (steepN > 0.0) {
          float e = max(3.0, camD * 0.006);
          vec2 q = wp + vGW.y * vec2(0.35, -0.25);
          float cx = gCrag(q + vec2(e, 0.0)) - gCrag(q - vec2(e, 0.0));
          float cz = gCrag(q + vec2(0.0, e)) - gCrag(q - vec2(0.0, e));
          nW = normalize(nW - vec3(cx, 0.0, cz) / (2.0 * e) * 24.0 * steepN);
        }
        normal = normalize((viewMatrix * vec4(nW, 0.0)).xyz);
      }`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += gGlow;');
  };
  const prevKey = m.customProgramCacheKey;
  m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : '') + '-ground-' + key;
  return m;
}

// Ground contact for placed models (instanced): the foot of every building, rock and statue
// darkens where it meets the earth and a little moss and soil creep up it, so it sits in the
// land instead of standing on it.
export function contactGrade(m) {
  if (m.userData.contact) return m;
  m.userData.contact = true;
  const prev = m.onBeforeCompile, prevKey = m.customProgramCacheKey;
  m.onBeforeCompile = (sh, r) => {
    if (prev) prev(sh, r);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCW; varying float vCH;')
      .replace('#include <project_vertex>', `#include <project_vertex>
        #ifdef USE_INSTANCING
          vec4 cw = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
          vCH = cw.y - (modelMatrix * vec4(instanceMatrix[3].xyz, 1.0)).y;
        #else
          vec4 cw = modelMatrix * vec4(transformed, 1.0);
          vCH = cw.y - modelMatrix[3].y;
        #endif
        vCW = cw.xyz;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vCW; varying float vCH;\n${GROUND_NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        {
          float n = gNoise(vCW.xz * 0.9 + vCW.y * 0.3) * 0.6 + gNoise(vCW.xz * 3.1) * 0.4;
          float foot = 1.0 - smoothstep(0.0, 1.6 + n * 1.2, vCH);
          diffuseColor.rgb *= 1.0 - 0.45 * foot;
          float moss = (1.0 - smoothstep(0.0, 0.5 + n * 0.9, vCH)) * smoothstep(0.35, 0.6, n);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.24, 0.1), moss * 0.6);
        }`);
  };
  m.customProgramCacheKey = () => (prevKey ? prevKey.call(m) : '') + '-contact';
  return m;
}
