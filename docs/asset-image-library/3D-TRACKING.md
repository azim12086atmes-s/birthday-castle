# Linking generated 3D models to reference images

Use [IMAGE-LABELS.md](IMAGE-LABELS.md) to find any image and [COMPONENTS.md](COMPONENTS.md) to find an already named component. The corresponding tables are available as [image-labels.csv](image-labels.csv) and [model-tracker.csv](model-tracker.csv).

- Existing labels such as GEN-29 and INT-C01 stay unchanged.
- Other image IDs use REF plus 12 characters of their SHA-256 hash. These IDs do not depend on table order or future additions.
- Component IDs identify a target within a sheet. **GEN-29-C01 is the lotus capital**, while **GEN-29-C02 is the column shaft**. A motif or construction detail may need manual modelling rather than automated image-to-3D.
- A sheet can show multiple objects and views. Isolate the complete chosen object before generation. A preview ID, whole scene or archived palace variant is not automatically the selected design.

Name a generated model with its component ID, a descriptive name and a version:

`GEN-29-C01__lotus-capital__v001.glb`

For a component not yet listed, use its image ID and a unique descriptive component key:

`GEN-20__selected-garden-bench__v001.glb`

Send the model/file link and both the image ID and component name. For example: **“I generated GEN-29-C01, lotus capital, v001, from GEN-29.”** If several objects were generated together, identify the assembly and list its included component IDs. Naming helps identification, but the file must still be supplied or made accessible for inspection.

Record the actual output in model-tracker.csv: model_file (repository path or accessible link), model_version, generator, generator_job_id when available, model_sha256 and review_status. Add a row for each model variant/version; preserve the reference_image_id and reference_sha256 so later image edits cannot silently change provenance. Record a cropped generation input as its own image ID/hash when it differs from the board.

Model statuses: unregistered, generated, reviewed, needs-revision, integrated. All rows currently start as unregistered because this registry has not yet linked any supplied model files. An image upload or a filename alone does not mark a model generated, reviewed or integrated. Existing Blender builds elsewhere were not inventoried into this new register.

The CSV is the editable model intake record. asset-register.json contains the initial component catalogue and reference families; future imports should use the actual CSV registration records, rather than treating the initial JSON statuses as live progress.

No artwork pixels were modified by labelling. IDs and descriptions are stored beside the images and shown in the gallery, preserving clean generation references.

## Multi-component packs

Use PACK-BRG-001 for the 16-piece ornament kit and PACK-BRG-002 for the four bridge segment types. Both images print each item name beside its local ID. The globally unique model IDs include the sheet prefix: `PACK-BRG-001-A14` is Crystal lantern; `PACK-BRG-002-S01` is Lower-tier arch span.

For a generator returning one file containing the whole pack, record the batch in batch-model-tracker.csv, e.g. `PACK-BRG-001__ornament-kit__v001.glb`. After inspecting its actual contents, use model_batch_id and mesh_name in model-tracker.csv to link each identifiable part to the shared file, or record separately exported files. A batch submission does not prove that all 16 objects were returned or separated correctly. Missing, fused or inaccurate parts retain needs-revision status until repaired.

## Reference revisions

PACK-BRG-001 revision 2 replaces A03 with the user-supplied stepped lotus capital. The part ID remains PACK-BRG-001-A03. Record the reference SHA-256 or revision when generating a model. An existing model made from revision 1 keeps that original reference hash; it does not automatically become a match to revision 2.

## Source overrides and missing-only generation

Use BRIDGE-REFERENCE-SET.md for current bridge intake. Adequate original source crops override inaccurate generated interpretations without another image-generation call. Current component IDs remain stable; source histories preserve prior hashes. PACK-BRG-003 contains only S05 Wide arch span, S06 Slender central support and S07 Shore approach segment. Model IDs are PACK-BRG-003-S05/S06/S07. Existing output files, when supplied, retain their original reference provenance.

## Complete roof layout and staircase network

[PAL-ROOF-PLAN-001](palace-roof-plan/PAL-ROOF-PLAN-001.png) is a coordinate-authored layout proposal, with [33 placement IDs](palace-roof-plan/tower-placements.csv) and [11 staircase links](palace-roof-plan/stair-connections.csv). Placement IDs name instances, not new mesh assets. Match generated models to their archetype and fill mesh_asset_id in the placement register when models exist. Source GEN-37 remains the appearance master; proposed depths require review.

## Modular palace wall intake

The roof-plan study is unapproved and paused. Use the [wall kit component register](palace-wall-kits/components.csv) for the first wall batch. Each sheet has four named parts. If generated together, record the batch ID and map the actual separated mesh names to S01–S04. Existing glass/carving models can be reused via reuse-bindings.json; the complete palace inventory is deferred. Join contracts are proposals until model bounds, ends, thickness and trim datums have been checked.

## Terminal tower input

Use PAL-TOWER-001 for four structural sections and PAL-TOWER-001-DECOR for16 detachable details. Full part IDs are PAL-TOWER-001-S01…S04 and PAL-TOWER-001-D01…D16. Original source sections control proportions; shaded backs and profiles are inferred. No Blender models were produced. Record an actual batch mesh file only after identifying each separated component.

## Remaining screenshot inputs

[96 source-linked targets](remaining-palace-kits/components.csv) comprise32 structural sections and64 fitting parts on12 sheets. Shared lantern/star/crown/planting references count once. Model filename uses the printed part ID. All targets remain unregistered and pending reference review. Family schedules describe proposed joins, inferred back faces and remaining shape issues. No generated model is implied by a sheet.
