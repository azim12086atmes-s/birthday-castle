// Real trees for the forests (world pass 2, Oct 18): the groves of coast.js now grow our Meshy
// trees instead of cones and balls. Every tree draws as its picture card (8 views round the
// model, the one facing the camera on an upright billboard, as the world fill does), and the
// ones near the player swap to the 3D model, so a walk through the woods has real trunks and
// leaves while the far forests cost two triangles a tree.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { MOOD, FOG_COLOR } from './sky.js';
import { ATMOS_GLSL, atmosUniforms } from './look.js';
import { nightGrade } from './materials.js';

// species: model name and grown height range (m)
export const SPECIES = [
  { name: 'A_towering_ancient_oa', h: [13, 22] },   // 0 oak: the valley woods
  { name: 'A_sprawling_forest_bu', h: [7, 11] },    // 1 lilac blossom tree
  { name: 'Pin_tree_', h: [18, 30] },               // 2 pine: the slopes
  { name: 'Copper_Cloud_Bonsai', h: [7, 10] },      // 3 copper cloud tree
  { name: 'Ember_Tree', h: [8, 12] },               // 4 ember tree
  { name: 'Enchanted_Wisteria_Tr', h: [9, 13] },    // 5 wisteria
  { name: 'A_majestic_forest_fer', h: [2.2, 3.8] }, // 6 fern: the understory
];
export const FERN = 6;

// which tree grows here: pines take over up the slopes, oaks keep the valleys,
// with blossom, wisteria and the magical copper and ember trees scattered through
export function pickSpecies(r, y) {
  if (r() < THREE.MathUtils.smoothstep(y, 120, 520) * 0.85 + 0.1) return 2;
  const x = r();
  return x < 0.6 ? 0 : x < 0.76 ? 1 : x < 0.86 ? 5 : x < 0.94 ? 3 : 4;
}

// dip: GLSL that sinks a card onto the coarse land mesh beyond the fine tiles (from coast.js)
function cardMaterial(map, card, dip) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map }, uFrame: { value: card.frame }, uLift: { value: card.base_from_centre * card.frame },
      uNear: { value: 0 }, uNight: MOOD.night, uFog: { value: FOG_COLOR }, ...atmosUniforms(FOG_COLOR),
    },
    vertexShader: /* glsl */`
      attribute float aDy;
      uniform float uFrame, uLift, uNear; varying vec2 vUv; varying float vK; varying vec3 vW; varying vec3 vTint; varying float vFade;
      void main(){
        vec3 base = instanceMatrix[3].xyz, c0 = instanceMatrix[0].xyz;
        float s = length(c0), rot = atan(-c0.z, c0.x);
        ${dip}
        vec3 centre = base + vec3(0.0, uLift * s, 0.0);
        vec2 d = cameraPosition.xz - centre.xz;
        float ang = atan(d.x, d.y) - rot;
        vK = mod(floor(ang / 0.7853982 + 0.5) + 16.0, 8.0);
        vec3 right = normalize(vec3(d.y, 0.0, -d.x));
        vec3 w = centre + right * position.x * uFrame * s + vec3(0.0, position.y * uFrame * s, 0.0);
        vUv = uv; vW = w;
        vFade = (length(d) - uNear) / 12.0;
        #ifdef USE_INSTANCING_COLOR
          vTint = instanceColor;
        #else
          vTint = vec3(1.0);
        #endif
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap; uniform float uNight; uniform vec3 uFog;
      varying vec2 vUv; varying float vK; varying vec3 vW; varying vec3 vTint; varying float vFade;
      ${ATMOS_GLSL}
      void main(){
        // near trees are 3D: the card dissolves into them over a few metres
        if (vFade < fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453)) discard;
        vec4 c = texture2D(uMap, vec2((vK + clamp(vUv.x, 0.002, 0.998)) / 8.0, vUv.y));
        if (c.a < 0.5) discard;
        vec3 col = c.rgb * vTint;
        // a little richer and fresher green, as leaves read in sunlight
        float l = dot(col, vec3(0.3, 0.59, 0.11));
        col = mix(vec3(l), col, 1.25) * vec3(1.02, 1.1, 1.0);
        // a little light down the crown, darker toward the roots
        col *= 0.82 + 0.28 * smoothstep(0.1, 0.8, vUv.y);
        col *= mix(vec3(1.0), vec3(0.36, 0.46, 0.92), uNight);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
        gl_FragColor.rgb = atmosApply(gl_FragColor.rgb, vW, uFog);
      }`,
  });
}

export function createTreeKit(scene, quality, dip) {
  const nearR = quality.key === 'low' ? 0 : quality.key === 'medium' ? 90 : 140;
  const kit = { ready: false, cardGeo: new THREE.PlaneGeometry(1, 1), cardMat: [], cardH: [], near: [], nearR };
  const texLoader = new THREE.TextureLoader();
  fetch('data/world/cards/index.json').then((r) => r.json()).then((j) => {
    let left = SPECIES.length;
    SPECIES.forEach((sp, i) => {
      const card = j.cards[sp.name];
      kit.cardH[i] = card.height;
      texLoader.load(`data/world/cards/${sp.name}.webp`, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
        kit.cardMat[i] = cardMaterial(tex, card, dip);
        if (--left === 0) kit.ready = true;
      });
    });
  });
  // near models, loaded once each
  if (nearR > 0) {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    SPECIES.forEach((sp, i) => {
      loader.load(`data/world/near/${sp.name}.glb`, (gltf) => {
        gltf.scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const meshes = [];
        gltf.scene.traverse((o) => {
          if (!o.isMesh) return;
          const geo = o.geometry.clone();
          for (const name of ['position', 'normal']) {
            const at = geo.attributes[name];
            if (!at || at.array instanceof Float32Array && !at.isInterleavedBufferAttribute) continue;
            const f = new Float32Array(at.count * at.itemSize);
            for (let k = 0; k < at.count; k++) for (let c = 0; c < at.itemSize; c++) f[k * at.itemSize + c] = at.getComponent(k, c);
            geo.setAttribute(name, new THREE.BufferAttribute(f, at.itemSize));
          }
          geo.applyMatrix4(o.matrixWorld);
          const mat = o.material;
          mat.metalness = 0; mat.roughness = 0.9;
          if (mat.map) { mat.alphaTest = Math.max(mat.alphaTest, 0.4); mat.transparent = false; }
          mat.side = THREE.DoubleSide;
          // the leaves let light through: lift the shaded side so near trees match their cards
          if (mat.map) { mat.emissiveMap = mat.map; mat.emissive = new THREE.Color(0.32, 0.32, 0.32); }
          nightGrade(mat, 'tree-' + i + '-' + meshes.length);
          const im = new THREE.InstancedMesh(geo, mat, 512);
          im.count = 0; im.frustumCulled = false;
          scene.add(im);
          meshes.push(im);
        });
        kit.near[i] = { meshes, h: box.max.y - box.min.y || 1 };
      });
    });
  }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const lists = SPECIES.map(() => []);
  // pts: [x, y, z, rotY, height, species] of the trees in built tiles near the camera
  kit.updateNear = (cam, tiles) => {
    if (!nearR) return;
    for (const l of lists) l.length = 0;
    for (const t of tiles) {
      if (!t || !t.visible) continue;
      const pts = t.userData.trees;
      if (Math.hypot(t.userData.cx - cam.x, t.userData.cz - cam.z) > nearR + 600) continue;
      for (const pt of pts) if (Math.hypot(pt[0] - cam.x, pt[2] - cam.z) < nearR + 6) lists[pt[5]].push(pt);
    }
    lists.forEach((list, i) => {
      const N = kit.near[i];
      if (kit.cardMat[i]) kit.cardMat[i].uniforms.uNear.value = N ? nearR : 0;
      if (!N) return;
      const n = Math.min(list.length, 512);
      for (const im of N.meshes) {
        for (let k = 0; k < n; k++) {
          const [x, y, z, rot, h] = list[k], sc = h / N.h;
          q.setFromAxisAngle(up, rot); s.setScalar(sc); p.set(x, y - 0.3, z);
          im.setMatrixAt(k, m4.compose(p, q, s));
        }
        im.count = n; im.instanceMatrix.needsUpdate = true;
      }
    });
  };
  return kit;
}
