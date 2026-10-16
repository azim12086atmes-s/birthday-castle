S = 2.75
# px -> x1,z1 metres at x1 scale (map sheet 04, 6 m per px, palace B01 at px (670,490))
PX0, PZ0, MPP = 670, 490, 6.0
# code: (name, x1, z1, w1, d1)  x1,z1 from owner-sketch-spec.md section 1; w1,d1 from locations.csv (x1 scale)
LANDMARKS = {
 'B02':('Moon Water Palace',-630,1320,210,150),'B03':('Star Chapel',750,1410,100,160),
 'B04':('Rose Keep',-960,-540,180,160),'B05':('Misty Keep',1020,-900,160,180),
 'B06':('Pagoda',1050,-420,85,85),'B07':('Temple Rotundas',-30,-1260,120,120),
 'B08':('Colosseum',-1020,-1140,280,210),'B09':('Lagoon City',-2460,1200,450,400),
 'B10':('Canyon Palace',1560,1560,240,180),'B11':('Crescent Arch',2640,1920,220,70),
 'B12':('Storybook Village',-2400,780,340,280),'B13':('Windmill',-2190,240,55,55),
 'B14':('Pillar Sky City',2220,240,420,420),'B15':('Jungle Temple',1860,2580,240,220),
 'B16':('Fjord Longhouse',-2280,-1020,150,70),'B17':('Glowwood Ruin',-2040,-300,220,180),
 'B18':('Mother Tree',-1320,1800,280,280),'B19':('Lantern Cove',-1650,2280,140,65),
 'B20':('Bridge Pavilions',-60,2340,48,48),'B21':('Tidal Observatory',-2580,2760,110,110),
 'B22':('Lighthouse',-1920,3180,45,45),'B23':('Sea Pavilion',1620,3480,65,65),
 'B24':('Reef Shrine',2940,3120,85,85),'B25':('Crystal Conservatory',-420,-540,180,100),
}
HEIGHT_OVERRIDE = {'B22':110,'B13':60,'B06':95,'B07':45,'B03':150,'B02':200,'B14':250,'B08':55,'B09':60}
SKY = {'I Crystal Garden':(1560,-1680,1300),'II Aurora Isle':(-3240,-1500,1700),
       'IV Unicorn Meadow':(2760,4320,1500),'V Starfall Isle':(-180,-2280,1900)}  # x1,z1, height (world m)
# Meshy kit markers: model -> (code, size_m at x1 world (human scale; not x S), dx, dz offsets in landmark widths)
KITS = {
 'Stone_Portal':('B10',60,-.9,.6),'Lantern_Gate_to_the_S':('B19',30,.8,.5),'Koi_Pond_with_Stone_B':('B02',12,.9,-.8),
 'Enchanted_Garden_with':('B25',60,.9,.9),'An_english_country_co':('B12',140,.9,-1),'Enchanted_Garden_Gate':('B25',3,-.8,.6),
 'stone_henge':('B17',40,-1.6,.8),'Celestial_Armillary':('B21',18,.9,.9),'The_Arcane_Gateway':('B14',90,1.2,1.2),
 'Classical_Sculpture_C':('B01',3,.0,1.4),'Yuki':('B02',6,-.9,.9),'Stone_Serenity_Bridge':('B09',30,.9,.9),
 'Ancient_Stone_Arch_Br':('B20',40,.0,-1.2),'Gothic_Iron_Fence':('B01',3,.2,1.6),'Ember_Tree':('B07',30,1.1,.3),
 'Copper_Cloud_Bonsai':('B06',6,1.0,-1.0),'Medieval_Cottage':('B12',12,-.6,.9),'Mosswood_Teardrop_Hou':('B12',10,-.2,1.1),
 'Mediterranean_Villa':('B09',18,-.9,-.9),'Vintage_Stone_Villa':('B10',25,.9,-1.1),'Gothic_Cathedral':('B03',160,.0,.0),
 'Cathedral_Render':('B07',120,1.3,.6),'Leafspire_Cathedral':('B25',100,-.5,-1.1),
}
