import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const dir = new URL('./', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, dir), 'utf8'));
const hash = data => createHash('sha256').update(data).digest('hex');
const batch = await read('asset-handoff.json');
const source = await readFile(new URL(batch.source.file, dir));
assert.equal(hash(source), batch.source.sha256, 'Reference source changed; re-audit before issuing the handoff');
assert.deepEqual([source.readUInt32BE(16), source.readUInt32BE(20)], batch.source.pixel_dimensions);
assert.equal(hash(await readFile(new URL('../../world-layout/layout.json', dir))), batch.preservation.world_layout_sha256, 'Canonical world layout changed');
const kit = await read('../kit-fit/contract.json');
const ids = new Set();
const sheets = {};
for (const id of batch.reference_budget.dedicated_sheet_ids) {
  const folder = `../../completion-pass/${id}/`;
  const schedule = await read(`${folder}schedule.json`);
  const catalog = await read(`${folder}components.json`);
  const files = await readdir(new URL(folder, dir));
  sheets[id] = { catalog, schedule, images: files.filter(x => /\.(png|jpe?g|webp)$/i.test(x)) };
  assert.equal(schedule.outputs.length, 1, `${id} must have one selected output`);
  const output = schedule.outputs[0];
  assert.equal(hash(await readFile(new URL(`../../${output.file}`, dir))), output.sha256, `${id} reference hash mismatch`);
  assert.equal(schedule.physical_join_fit_verified, false);
  assert.equal(schedule.view_geometry_parity_verified, false);
}
for (const a of batch.assets) {
  assert(!ids.has(a.asset_id), 'Duplicate asset ID');
  ids.add(a.asset_id);
  assert(a.dimensions_m_proposed.every(v => Number.isFinite(v) && v > 0));
  assert(a.filename.startsWith(`${a.asset_id}__`) && a.filename.endsWith('__v001.glb'));
  const sheet = a.asset_id.replace(/-[SD]\d+$/, '');
  assert(sheets[sheet].catalog.components.some(c => c.asset_id === a.asset_id), `Unregistered slot: ${a.asset_id}`);
  assert(sheets[sheet].schedule.parts.some(c => c.asset_id === a.asset_id), `Unscheduled slot: ${a.asset_id}`);
  assert.deepEqual(sheets[sheet].catalog.components.find(c => c.asset_id === a.asset_id).dimensions_m_proposed, a.dimensions_m_proposed, `Schedule/handoff dimension mismatch: ${a.asset_id}`);
  const [x0,y0,x1,y1] = a.source_region_xyxy;
  assert(x0 >= 0 && y0 >= 0 && x1 <= batch.source.pixel_dimensions[0] && y1 <= batch.source.pixel_dimensions[1] && x1 > x0 && y1 > y0);
}
const byId = id => batch.assets.find(a => a.asset_id === id);
const stair = byId('B04-STRUCT-001-S04');
assert.equal(stair.stairs.risers, kit.flight.risers);
assert.equal(stair.stairs.rise_m, kit.flight.rise_m);
assert.equal(stair.stairs.going_m, kit.flight.going_m);
assert.equal(stair.dimensions_m_proposed[0], kit.flight.width_m);
assert.equal(stair.stairs.clear_width_m, kit.flight.clear_width_m);
assert.equal(stair.stairs.landing_side_m, kit.landing.size_m[0]);
assert.equal(stair.stairs.risers * stair.stairs.rise_m, kit.flight.total_rise_m);
const placements = batch.assembly_proposal.placements;
const at = (id, port) => {
  const a = byId(id), t = placements.find(p => p.asset_id === id);
  assert.equal(t.yaw_degrees, 0, 'This check handles the declared zero-yaw test placements only');
  return a.ports.find(p => p.name === port).position_xyz_m.map((v,i) => v+t.position_xyz_m[i]);
};
const near = (a,b) => a.every((v,i) => Math.abs(v-b[i]) <= batch.export_contract.seam_tolerance_m);
assert(near(at(stair.asset_id,'upper_straight'), at('B04-STRUCT-001-S03','south_arrival')), 'Stair/terrace port mismatch');
assert(near(at('B04-STRUCT-001-S03','north_gate'), at('B04-STRUCT-001-S02','entrance')), 'Terrace/entrance port mismatch');
assert(near(placements.find(p => p.asset_id.endsWith('-D07')).position_xyz_m, at('B04-STRUCT-001-S02','entrance')), 'Arch surround datum mismatch');
assert.equal(byId('B04-DETAIL-001-D05').dimensions_m_proposed[0], kit.parapet.repeat_m);
assert.equal(byId('B04-DETAIL-001-D05').dimensions_m_proposed[2], kit.parapet.height_above_nosing_m);

const dims = a => a.dimensions_m_proposed.join(' × ');
const structural = batch.assets.filter(a => a.asset_id.includes('-STRUCT-'));
const fittings = batch.assets.filter(a => a.asset_id.includes('-DETAIL-'));
const row = a => `| ${a.order} | \`${a.asset_id}\` | ${a.name} | ${dims(a)} |`;
const details = batch.assets.map(a => `### ${a.order}. ${a.name}

**ID:** \`${a.asset_id}\` · **File:** \`${a.filename}\` · **Proposed W × D × H:** ${dims(a)} m

${a.construction}

**Pivot and alignment:** ${a.origin}

**Reference lookup:** original-pixel box [${a.source_region_xyxy.join(', ')}]. ${a.source_region_note}

**Reject if:** ${a.reject_if.join('; ')}.
`).join('\n');
const md = `# Rose Keep — first 3D asset batch

[World production plan](../README.md) · [Rose Keep brief](../../world-layout/location-audit/B04/DESIGN-BRIEF.md) · [Machine-readable handoff](asset-handoff.json) · [Validation record](validation.json) · [One-image gallery browser check](gallery-verification.json)

Prepare **eight reusable meshes**, in the order below: four structural sections, then four matching fittings. These let us inspect one entrance/stair/terrace assembly and a separate turret specimen before requesting the rest of the keep. This is a preparation list, not a delivered model pack.

## Existing reference and style

![Existing B04 Rose Keep source; the only image loaded by this document](${batch.source.file})

Use **blush stone, pale stone trim, burgundy shingle cones, restrained gold accents, round turrets and climbing roses over irregular rock shoulders**. Keep the window treatment subtle. The source does not support replacing these cones with purple onion domes or giving every window the palace's saturated stained glass. Rose plants, banners, lamps and rock hosts stay separate from the structural meshes.

The source is only **415 × 372 px**. It establishes the visible design vocabulary; it cannot resolve exact carving or hidden faces. Pixel boxes below identify where to look in this one saved original. They are not new cropped/generated sheets. Proposed rear geometry must remain labelled as inferred.

## First batch

All sizes are **proposed metres, W × D × H**. They define a local test kit; they are not measured from the picture. People, doors and steps retain human dimensions even while the landmark has a much larger reservation.

| Order | Existing component ID | Mesh | Proposed W × D × H (m) |
| --- | --- | --- | --- |
${structural.map(row).join('\n')}
${fittings.map(row).join('\n')}

Start with the **wall/entrance host and stair**. Test their openings and steps before spending effort on the turret, roof and surface ornament. D01 is a roof quadrant: four instances make one roof. D03 is an insert: its host needs an actual cutout.

## Saved references and image limit

The two existing reserved sheets are now saved: [B04-STRUCT-001 — four structural sections](../../completion-pass/B04-STRUCT-001/README.md) and [B04-DETAIL-001 — twelve fittings](../../completion-pass/B04-DETAIL-001/README.md). Open either separately to keep only one image in view. Both R01 drafts and the exact generation/correction prompts are preserved. User reference approval remains pending.

The old generic structural dimensions have been replaced with this handoff's proposed fit dimensions in the B04 schedules and component records. This corrects planning placeholders; it does not certify the generated pixels as accurate measurements. The four fittings prioritised here are a subset of the twelve-part decor sheet. This pass uses **two existing slots**, adds no new reservations, and adds no accepted models.

Known limits: the structural sheet's small stair plan and turret plan are schematic rather than verified projections. The wall's host arch trim must not be blindly doubled with the separate D07 surround. D09 must use flush stone inlay even where painted rose shading suggests relief. Cornice closure, roof-quadrant joins, rail corners and all scale/contact details need geometry checks before production use.

## Join and export rules

- Export GLB in metres, with applied scale. An editable Blender file is useful alongside it. Exported GLB axes are X right, Y up, front -Z; let Blender's normal glTF exporter convert Z-up to Y-up.
- Use the filenames and pivots below. Keep stone shell, glazing and fittings as distinct named objects/materials. Never recenter a mesh after declaring its assembly origin.
- Keep openings genuinely open. A window insert is separate from its wall cutout; an arch surround does not supply a doorway by itself.
- Keep one-metre parapet repeats at their declared length. Use explicit end infill; slope and corner pieces remain outstanding.
- Supply simple substrate collision separately. Avoid convex hulls that seal entrances or hollow towers. Fine carving and foliage need not each carry collision.
- Proposed unique-mesh triangle allowance: **${batch.assets.reduce((s,a)=>s+a.target_triangles_proposed,0).toLocaleString('en-US')} triangles** across these eight assets, before instances. This is a starting budget, not measured browser performance. Prefer shared materials and a 2K atlas; review accepted meshes before setting final LOD/texture budgets.

## First assembly check

The JSON includes example placements. The stair climbs **1.5 m** over ten 0.15 m risers and joins the terrace; the terrace joins a **2.4 m clear** doorway. The three declared join datums match numerically within 1 mm. The turret stands separately so its ring, window and four roof-quadrant joins can be inspected without inventing the final building plan.

These are metadata checks. The next Function prototype must supply the supported inner court stub, rock/substrate contacts, continuous guards and stair returns, then test a real player from approach through the doorway and back. No browser traversal, terrain grading, mesh fit or finished building is established by the list.

The existing world anchor **(-1700, -1500)**, **180 × 160 m** reservation and **78 m** pad stay unchanged. The inherited 360 m building-height entry is not used to multiply furniture, risers or door widths. Full tower height and placement need the source-led assembly review.

## Component instructions

${details}
## Reuse and next batches

Reuse the tested [K09 stair/landing dimensions](../kit-fit/contract.json) and independent barrier conventions, while keeping Rose Keep's local appearance. Shared foliage/rock/prop families are reuse candidates, not certified style matches or available final models.

${batch.deferred.map(x=>`- ${x}`).join('\n')}

Next build the source-compatible Function specimen for these eight priority parts, using the dimension contract to resolve illustration discrepancies. Test source-specific cornices, rail returns, ledge supports and climbing-rose attachments as they are needed. Inspect **B25 Crystal Conservatory** separately, using its glass/gold dome source rather than recolouring this keep. Regional route and entrance evidence still comes before dense planting and final dressing. Bath/spa, kitchen/service and music rooms remain outside the agreed playable scope.

Rebuild/check this handoff from the repository root with \`node docs/asset-image-library/world-production-plan/rose-keep/build-handoff.mjs\`. Validation checks source hashes, registered IDs, source-region bounds, shared stair dimensions and proposed join coordinates. It does not approve artwork or model topology.
`;
await writeFile(new URL('README.md', dir), md);
await writeFile(new URL('validation.json', dir), JSON.stringify({
  batch_id: batch.batch_id,
  handoff_sha256: hash(await readFile(new URL('asset-handoff.json', dir))),
  canonical_layout_unchanged: true,
  source_hash_matches: true,
  source_images_inspected: 1,
  selected_reference_sheets_saved: Object.keys(sheets).length,
  generated_attempts_preserved: Object.values(sheets).reduce((n,s)=>n+s.schedule.outputs.length+s.schedule.previous_attempts.length,0),
  existing_component_ids_verified: ids.size,
  missing_reserved_sheet_images: [],
  k09_dimensions_match: true,
  proposed_join_datums_checked: 3,
  proposed_join_datums_match: true,
  total_unique_triangle_target_proposed: batch.assets.reduce((s,a)=>s+a.target_triangles_proposed,0),
  geometry_or_browser_checks_run: false,
  accepted_models_added: 0,
  limitation: 'Metadata integrity only; reference approval, actual mesh joins, terrain supports, collision and movement remain pending.'
}, null, 2)+'\n');
console.log(`Verified ${ids.size} existing component IDs, source/layout hashes, K09 dimensions and three proposed join datums. Wrote README.md and validation.json; no geometry generated.`);
