# Continue without bulk image loading

Keep all originals, named outputs and superseded drafts. Reducing loaded references does not mean deleting saved files.

1. Read `queue.json`, `production-budget.json` and the next sheet's `schedule.json` as text. An allocation or queued prompt is not a saved image.
2. Check the next schedule, local output directory and attempt count before generating. Recover an already-generated file after an interruption; do not generate a duplicate just because the index is behind.
3. Inspect one source image at a time. Pass only that source to generation. Do not load all original boards, a large contact sheet, the PDF and previous generations together.
4. Generate one sheet, save it under its stable sheet ID, record source/output hashes, and review the result before beginning the next. Use small review batches; do not run a long loop that automatically streams many images.
5. Mark visible discrepancies in `visual_review_notes`. A generated view is not verified orthographic geometry, a measured construction detail, a seamless texture or a separate mesh. Keep proposed layout/contacts explicit.
6. Refresh the main archive/component indexes and validate them before publishing a checkpoint. Preserve the queue of remaining work; do not call the complete library finished at an intermediate checkpoint.

## Current review handoff

The owner's2026-10-15 request adds a west circular flower balcony to the bedroom, raises bedroom/dining apex heights to18m, and adds finished bedding plus personal and shared room decor. Prior room sheets are preserved as R01 drafts. See [bedroom changes and component map](BEDROOM-UPDATE.md).

Inspect the notes for known image contradictions: a rail crosses the approach in one bedroom view; bedroom data prints an8x8m neck instead of8x4m and a4m bed canopy instead of the existing2.8m. The dedicated balcony and bedding sheets show the intended dimensions. Table cut-end aprons, frame back panels, textile pattern joins and support/hardware fit still need model review. Named prototype dimensions and saved layout proposals control these corrections; the images are not measured orthographic drawings.

The selected palace slots have references saved, including bedding, personal items, textiles, library, gallery and atelier props. This is not proof of full palace asset completeness or fitted geometry. Remaining queued generation now starts with source-specific map building kits, followed by shared terrain/ecology. Keep the global230-sheet ceiling;211slots are allocated after this update, leaving19unallocated.

No Blender, Meshy, paid model generation or runtime modifications are part of this reference pass.
