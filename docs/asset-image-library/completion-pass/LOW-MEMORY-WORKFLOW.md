# Continue without bulk image loading

Keep all originals, named outputs and superseded drafts. Reducing loaded references does not mean deleting saved files.

1. Read `queue.json`, `production-budget.json` and the next sheet's `schedule.json` as text. An allocation or queued prompt is not a saved image.
2. Check the next schedule, local output directory and attempt count before generating. Recover an already-generated file after an interruption; do not generate a duplicate just because the index is behind.
3. Inspect one source image at a time. Pass only that source to generation. Do not load all original boards, a large contact sheet, the PDF and previous generations together.
4. Generate one sheet, save it under its stable sheet ID, record source/output hashes, and review the result before beginning the next. Use small review batches; do not run a long loop that automatically streams many images.
5. Mark visible discrepancies in `visual_review_notes`. A generated view is not verified orthographic geometry, a measured construction detail, a seamless texture or a separate mesh. Keep proposed layout/contacts explicit.
6. Refresh the main archive/component indexes and validate them before publishing a checkpoint. Preserve the queue of remaining work; do not call the complete library finished at an intermediate checkpoint.

## Current review handoff

The conservatory sheet was recovered from its existing local PNG without regeneration. Its pool-edge and railing cells include surrounding bay context. The suite shell sheet isolates four hosts, but tiny top diagrams need opening corrections. Bedroom view B swaps two furniture corner groups; the saved plan and cutaway control their intended positions. Dining seating counts need model review. The table-end underside has extra legs, and the centre-module front diagram shows an apron at a joining edge: follow the explicit proposed join contract and correct these when modeling.

Next missing references are library props, gallery props, atelier props and textile joining details, followed by the source-specific map building kits and shared ecology/terrain queue. Reuse the existing celebration chair, mirrors, lights, textiles and foliage where they already fit.

No Blender, Meshy, paid model generation or runtime modifications are part of this reference pass.
