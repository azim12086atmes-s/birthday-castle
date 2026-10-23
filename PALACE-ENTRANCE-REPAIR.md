# Palace entrance repair

The rose gate now has a real opening through its backing masonry, a supported gallery floor, and collision volumes that move with the lower leaves. Only the upper fanlight stays fixed. The upper window relief follows the glazing arch instead of covering it. Human-scale grass and flower beds fit around the existing crown court's fountain, mirror pool, conservatory and central avenue.

The identical geometry was reviewed in Golden Thread's complete birthday integration at commit 7d5f52c95a08e200f3f6e6c4ca2fd2c6ef36ab04. Its browser review captured closed/open gates and the window relief, walked the actual controller through the entrance, and confirmed courtyard planting finished loading. The geometry check rejects non-finite vertices and tests 69 points along the supported entrance route. See https://github.com/azim12086atmes-s/Golden-Thread/actions/runs/39901611148 for the full review and screenshots.
