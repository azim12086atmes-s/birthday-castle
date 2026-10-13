# Continuous palace front and entrance correction

The owner identified drifting tower positions, inconsistent wings and a disjoint five-bay hero wall in the previous layer sheets. Those sheets are retained but marked **inconsistent / not placement masters**. Correct the connected structure before deriving another set of independent modules.

## Two requested complete views

- **PAL-FRONT-001:** one whole front with all attached wings and original tower groups, plus one enlarged view of the entire connected five-arch wall.
- **PAL-ENTRY-001:** one entrance assembly in true overhead plan and longitudinal side section. It must show the retaining wall, arrival notch, paired dry stairs, wet cascade, L1 terrace and gate-wall setback together.

The original [GEN-37 front](../images/illustrated-boards/GEN-37.png) remains the visual authority. Image generation is a reconstruction study; it does not establish exact mesh placement or view registration. The [schedule](schedule.json) records source anchors, prompts, numeric constraints and remaining uncertainty.

## Five arches form one wall

| Mark | Source function | Relationship |
| --- | --- | --- |
| G1 | Western outer great glazed bay | First of two western large arches |
| G2 | Western inner great glazed bay | Directly connects to the central entrance range |
| G3 | Central ceremonial entrance | Gate gable, star-rose, original entrance axis |
| G4 | Eastern inner great glazed bay | First of two eastern large arches |
| G5 | Eastern outer great glazed bay | Joins the eastern return and belvedere range |

The owner's “five gates” identifies these five dominant openings. Four are glazed in the original. Keep that original function and tracery rather than silently turning all five into matching walk-through doors. Their connecting piers belong to a **single wall substrate**, with shared cornice, sill/terrace datum and continuous roof support. No gaps, separate plinths or new domed end towers at segment cuts.

Use source-projected anchor groups for the western terminal onion, western needle, broad western pavilion, royal needle, eastern belvedere, eastern chapel-spire cluster and eastern terminal onion. These are approximate visual anchors, not calibrated metre coordinates. The royal needle is offset from the gate axis in the original; do not force symmetry. Smaller turrets remain tied to their parent source groups.

## Ground-facing wall to gate wall

Set the gate front to **Y=0**, with south/front in negative Y. The confirmed entrance arrangement is:

| Element | Y, grid m | Z, grid m |
| --- | ---: | ---: |
| Ground-facing L1 retaining wall / stair foot | −150 | Ground 0; retaining roof 60 |
| Stair top | −75 | 60 |
| Walkable L1 arrival terrace | −75 to 0 | 60 |
| Gate-wall base and roof | 0 | 60 to 160 |

The wall-to-wall horizontal gap is **150 grid m = 412.5 world m**. The stair run uses the first 75 grid m; the arrival terrace uses the remaining **75 grid m = 206.25 world m**. Do not put the gate immediately at the stair top. The previous layer studies compressed or obscured this space.

The central arrival is a notch in the L1 base. The retaining wall continues on both sides, while dry stair routes flank the separate wet cascade. The central terrace maintains dry access to G3. Gardens, benches, lamps and small fountains occupy the side edges; they do not block the approach. Human-scale fittings keep their physical size rather than receiving the palace's ×2.75 structural multiplier.

Here the user's “Level 0 walls” is represented by the **ground-facing retaining/front wall** at the confirmed L1 front datum. No separate low outer perimeter fence position or height was supplied. Such a fence must remain a separate proposal if later required; it must not silently replace the 60 m retaining base.

The earlier proposed 30 grid m rear extension applies behind the palace ranges. It does not change this confirmed 150/75 m entrance arrangement. L4's horizontal setback remains unresolved. Upper tower depth positions and rear wing footprints are not measured from the illustration.

## Checks before splitting or modelling

Check the complete front first: five-bay count and adjacency, original tower-group locations, asymmetrical wing returns, gate gable, paired dry stairs and wet cascade. Then check the entrance plan and section against the recorded 150 m / 75 m / 60 m / 100 m constraints. Hidden layouts remain proposals even if the labels look correct. Every generated view must be checked for the same tower attachments and dimensions before independent modules are derived.

This pass generates reference sheets only. Both outputs are pending review; no palace model, measured footprint, approved mesh or paid image-to-3D submission is claimed. These two sheets occupy the two remaining layout/envelope slots, keeping that family at six and the palace at or below its 65-sheet cap.

The first front redraw and first entrance illustration were rejected during comparison. The front correction now uses a minimal annotation edit; the entrance correction uses two technical views so depth arrows cannot be confused with frontage width. Source pixels remain authoritative; generated annotations and hidden geometry still require review.
