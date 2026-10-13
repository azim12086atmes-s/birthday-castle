# Western terminal tower: first screenshot family

This pass covers **only the first terminal onion-dome tower**. The owner clarified that the deliverables are component sketch sheets, not Blender models, and requested one family at a time with a matching decor sheet.

The original [tower crop](../images/reference-crops-and-studies/T04-2bad18defb6a.png) is the visible design authority. Its pixels are identical to the corresponding GEN-37 crop. The repeated broad pavilion screenshots are another family and have not been generated in this pass.

## Structural sections

The structural sheet contains four pieces, stacked bottom to top:

| ID | Section | Connection |
| --- | --- | --- |
| PAL-TOWER-001-S01 | Stepped pedestal with small front lancet | Top J1 joins S02 bottom |
| PAL-TOWER-001-S02 | One tall star-glazed shaft | Top J2 joins S03 bottom |
| PAL-TOWER-001-S03 | Short arched crown gallery | Top J3 joins S04 underside |
| PAL-TOWER-001-S04 | Plum onion roof and gold finial | Seats on S03 at J3 |

Cuts follow existing horizontal stone bands. The [schedule](schedule.json) records native crop coordinates, approximate normalized section heights and a common front orientation. Those are source guides and modelling proposals, not measured building dimensions. Hidden backs, octagonal mating cores and underside details are inferred.

The generated sheet is a shaded construction study. Displayed part sizes should not be used as a pixel ruler; the direct source cuts remain the proportion reference. The first attempt had an overly long finial and shallow pedestal and remains in rejected-drafts. Actual joint fit requires verification after modelling.

## Detachable details

PAL-TOWER-001-DECOR contains D01–D16: shaft, capital, foot collar, arch frame, spandrel relief, frieze, straight cornice, corner return, gallery arch, eave crest, roof rib, spindle, star, lantern arm, lantern cage and pendant.

The [component register](components.csv) links each detail to S01–S04. The lantern chain is **tower mounting point → D14 arm → D15 cage → D16 pendant**. Roof detail D11 follows the dome; D12 takes D13 at its upper stem. The structural image shows installed ornament as an appearance guide, while the decor sheet isolates those parts.

These motifs reuse existing GEN-38/41/42/44/45 and related masters. The new pack supplies a consolidated generation reference and inferred mounting backs, rather than introducing a new ornament theme. Full palace inventory remains deferred.

All twenty part IDs and both batch IDs are registered with **no mesh supplied/generated**. Name later outputs with their part or batch ID and version so we can identify them. Preserve source profiles and normalize dimensions before assembly; do not rely on image-generated geometry to snap automatically.
