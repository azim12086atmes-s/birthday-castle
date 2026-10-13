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
