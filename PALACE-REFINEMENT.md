# Palace garden refinement

Base: birthday-castle `3fcc2b4728c51eca871c889fa545c9605d7ad8df`, the complete large-palace source selected in the branch audit. Work branch: `birthday/palace-gardens`.

This pass replaces repeated painted garden tiles on palace roofs and outer terraces with limestone paving and modeled planted beds. Organic bed outlines, low stone curbs, mixed canopy trees, branched trunks, hedges, open pergolas and seats provide depth and human scale. Nearby grass, flower and leaf atlases/geometry are preserved from Golden Thread `a6c20a4`, with shared-time wind and night grading adapted to this renderer. Instanced plants use bounded buffers and rebuild in rows; beams merge by material.

Opaque palace/approach surfaces now use rough stone/metal shading and subtle grain. Fixed camera-space shine is removed and broad daytime emission reduced. Original facade artwork, palace massing, gate, floor queries, stairs, fountains, portals and all gameplay modules are retained. Garden placement reads the actual roof/floor and architecture exclusions; it does not add blocking colliders or change progression.

The local text reference config was redacted during audit. That config is NOT committed in this change. The source branch retains its original config; party invitation secrets are not included.

Validation: JavaScript syntax checks passed. Full-game browser and route/planting checks are being run before visual approval. This is a palace source refinement; the full current Golden Thread multiplayer migration and hosted deployment are separate unfinished work.

