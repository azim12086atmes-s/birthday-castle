import json, os
S='/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
have={f[:-5] for f in os.listdir(S+'/fill/glb2') if f.endswith('.json')} | {f[:-5] for f in os.listdir(S+'/fill/glb') if f.endswith('.json')}
I=[]
def P(place, r, *ms, r0=160):
    for m, size, n in ms: I.append(dict(m=m, size=size, n=n, where='place', place=place, r=r, r0=r0))
def W(kind, ms, **kw):
    for m, size, n in ms: I.append(dict(m=m, size=size, n=n, where=kind, **kw))
# ---- places
P('B01', 1500, ('Golden_Crescent_Dolph', 18, 4), ('Winged_Crescent_Scept', 26, 2), ('Enchanted_Blossom_Tea', 9, 4), r0=900)
P('B02', 700, ('Ivory_Palace_Courtyar', 110, 1), ('Koi_Pond_with_Stone_B', 24, 3), ('Golden_Crescent_Dolph', 16, 2), ('Stone_Serenity_Bridge', 24, 2))
P('B03', 600, ('Crystal_Gate_of_Light', 22, 2), ('Celestial_Orrery_of_D', 18, 1), ('Orrery_of_the_Starbou', 16, 1), ('Celestial_Prism_Reliq', 14, 2))
P('B04', 650, ('Amethyst_Citadel', 95, 1), ('_Object_Ornate', 6, 3), ('_Object_Ornate_2', 6, 2), ('Enchanted_Garden_Gate', 10, 3), ('Enchanted_Garden_with', 30, 1))
P('B05', 650, ('A_massive_tall_scie_2', 85, 1), ('Winding_Stone_Tower', 18, 3), ('Obsidian_Citadel', 40, 1))
P('B06', 600, ('Untitled_6', 30, 3), ('Five_Tier_Pagoda_Gard', 35, 1), ('Koi_Pond_with_Stone_B', 22, 2))
P('B07', 650, ('A_very_large_ancient_', 80, 1), ('_Greece_A_floating_i', 24, 2), ('Solaris_Citadel', 30, 1))
P('B08', 600, ('Runestone_Altar', 14, 2), ('Ancient_Stone_Amphith', 60, 1))
P('B09', 650, ('Luminous_Coral_Citade', 60, 1), ('Untitled_3', 18, 3), ('Untitled_4', 14, 4), ('Tiki_Pavilion', 14, 2))
P('B10', 700, ('Egyptian_Palace', 70, 1), ('Sandstone_Palace_Mode', 30, 2), ('Untitled_5', 20, 2), ('Untitled', 15, 3))
P('B11', 500, ('Golden_Crescent_Dolph', 24, 1), ('Untitled_5', 20, 1))
P('B12', 600, ('Rpg_house', 14, 4), ('Timberstone_Tower_Hou', 14, 3), ('Toadstool_Tavern', 14, 2), ('Medieval_Cottage', 12, 3), ('house', 14, 2), ('Vinebound_Clocktower', 24, 1), ('An_english_country_co', 15, 3), ('Mosswood_Teardrop_Hou', 7, 3), r0=120)
P('B13', 600, ('Farmers_Market_Cart', 6, 3), ('Rustic_Market_Stall', 6, 3), ('Medieval_Cottage_2', 12, 3), ('Windmill_Haven', 22, 1))
P('B14', 650, ('Golden_Tree_of_the_Sk', 40, 3), ('Crystal_Tower_of_the_', 30, 2))
P('B15', 700, ('A_massive_imperial_pa', 90, 1), ('Sapphire_Grove_Citade', 20, 2), ('Highly_detailed_ancie', 24, 2))
P('B16', 600, ('Watchtower_T1', 12, 2), ('Watchtower_T2', 12, 2), ('Pin_tree_', 26, 10))
P('B17', 750, ('Mushroom_Citadel_on_a', 26, 1), ('Nova_Shroom', 12, 3), ('Nova_Shroom_2', 12, 3), ('The_Enchanted_Mushroo', 15, 3), ('Verdant_Citadel_of_th', 25, 1),
  ('Luminous_Crystalline_', 20, 4), ('Bioluminescent_Mushro', 7, 6), ('Embercap_Bloom', 8, 4), ('Luminescent_Mushroom_', 10, 4), ('_Object_Ornate_2', 5, 2), ('Ember_Tree_of_Knowled', 12, 2))
P('B18', 700, ('The_Enchanted_Game_Tr', 45, 1), ('The_Lanterned_Heart_T', 30, 2), ('Noodle_Tree_of_Life', 20, 2), ('Whispering_Willow_of_', 15, 3), ('Enchanted_Wisteria_Tr', 15, 4))
P('B19', 500, ('Voidlight_Lantern', 4.5, 10), ('Tiki_Pavilion', 14, 2))
P('B20', 600, ('Gateway_of_the_Rajput', 60, 1), ('Stone_Serenity_Bridge', 24, 2))
P('B21', 500, ('Untitled_2', 30, 1), ('Celestial_Prism_Reliq', 14, 1))
P('B22', 500, ('Untitled_5', 20, 1), ('Watchtower_T2', 12, 1))
P('B23', 500, ('Untitled_3', 18, 2), ('Tiki_Pavilion', 14, 2))
P('B24', 500, ('Emerald_Dolphin_and_t', 16, 1), ('Untitled_3', 18, 1))
P('B25', 650, ('Crystal_Lotus_of_Echo', 12, 2), ('Crystal_Peaks_PBR_', 30, 2), ('_PBR_Hyper_detailed', 25, 1), ('Nebula_Bloom', 5, 5), ('Twin_Flame_Bloom', 5, 4), ('Stylized_Cave_Plants', 4, 5), ('Prismatic_Citadel', 45, 1))
P('B26', 700, ('Crimson_Spire_Citadel', 120, 1))
P('B27', 700, ('Palace_of_the_Golden_', 50, 1), ('Palace_of_the_Four_Do', 70, 1), ('Tiered_Jaipur_Palace', 45, 1), ('wall', 8, 4), ('Rustic_Market_Stall', 6, 2))
P('B28', 600, ('Crystal_Lattice', 18, 6))
P('B29', 650, ('Crystal_Peaks_PBR_', 30, 3), ('Rainbow_Bismuth_Citad', 20, 2), ('Lantern_Gate_to_the_S', 25, 2), ('Crystal_Gate_of_Light', 22, 1))
P('B31', 650, ('Nebula_Bloom', 5, 6), ('Twin_Flame_Bloom', 5, 6), ('Enchanted_Garden_with', 30, 1))
P('B32', 650, ('Rainbow_Stage', 30, 1), ('Farmers_Market_Cart', 6, 3), ('Rustic_Market_Stall', 6, 3), ('Enchanted_Blossom_Tea', 9, 2), ('Turquoise_Palace_of_G', 40, 1))
# ---- relics on hilltops all over the land
W('hilltop', [('Arcane_Rift_Obelisk', 15, 20), ('Amethyst_Moonstone_Al', 16, 14), ('Runestone_Altar', 14, 12), ('Crystal_Gate_of_Light', 22, 8), ('Stone_Portal', 10, 12),
  ('The_Arcane_Gateway', 10, 10), ('_England_Mystic_Ston', 26, 6), ('stone_henge', 30, 6), ('Solaris_Citadel', 30, 5), ('Celestial_Prism_Reliq', 14, 8), ('Untitled', 15, 6),
  ('Untitled_2', 30, 6), ('Winding_Stone_Tower', 18, 8), ('_Romania_A_semi_real', 15, 8), ('Arcane_Ember_Gate', 12, 10), ('Winged_Crescent_Scept', 26, 6),
  ('Rainbow_Bismuth_Citad', 20, 6), ('Crystal_Tower_of_the_', 30, 6), ('Emerald_Gleam_Wall', 20, 8), ('Frostshard_Warhammer', 36, 3), ('Celestial_Orrery_of_D', 18, 3),
  ('Crystal_Lotus_of_Echo', 12, 6), ('Golden_Crescent_Dolph', 18, 4), ('wall', 8, 8), ('_Object_Charmi', 6, 6), ('_Object_Charmi_2', 6, 6)], smax=0.45, away=350)
W('wild', [('A_black_rock_wall_wi', 34, 6), ('highly_realistic_dior', 22, 6), ('Sapphire_Grove_Citade', 20, 4), ('Highly_detailed_ancie', 24, 6), ('Ancient_Stone_Arch_Br', 30, 4),
  ('Azure_Dome_Palace', 80, 1), ('Tiered_Jaipur_Palace', 45, 1), ('Sandstone_Palace_Mode', 30, 2), ('Vinebound_Clocktower', 24, 2), ('Golden_Tree_of_the_Sk', 40, 4)], smax=0.4, away=400)
# ---- flora by biome (10 forest, 11 blossom, 12 glowwood, 16 taiga, 8 meadow, 9 grass, 13 jungle, 3 lakes)
W('biome', [('A_majestic_forest_fer', 12, 60)], biomes=[10, 13, 12], away=200)
W('biome', [('A_towering_ancient_oa', 25, 50)], biomes=[10, 9], away=200)
W('biome', [('A_sprawling_forest_bu', 24, 25), ('Ember_Tree', 15, 20), ('Enchanted_Wisteria_Tr', 15, 30)], biomes=[11, 8], away=200)
W('biome', [('Twisted_Indigo_Tree', 14, 25), ('Luminous_Crystalline_', 20, 25), ('Bioluminescent_Mushro', 7, 40), ('Luminescent_Mushroom_', 10, 25),
  ('Embercap_Bloom', 8, 30), ('High_detail_fantasy_', 12, 20), ('Nova_Shroom', 12, 8), ('The_Enchanted_Mushroo', 15, 8)], biomes=[12], away=150)
W('biome', [('Pin_tree_', 26, 80)], biomes=[16, 17], away=200)
W('biome', [('Whispering_Willow_of_', 15, 20), ('The_Lanterned_Heart_T', 30, 6), ('Noodle_Tree_of_Life', 20, 6)], biomes=[10, 8, 9], away=250)
W('biome', [('Nebula_Bloom', 5, 60), ('Twin_Flame_Bloom', 5, 50), ('Stylized_Cave_Plants', 4, 40)], biomes=[8, 11, 12, 9], away=150)
W('biome', [('rock', 15, 40), ('Rock_Formations_Colle_2', 22, 15)], biomes=[7, 15, 17, 18, 19, 16], away=200, smax=0.7)
# ---- roads, plazas, coast, sea
W('roadside', [('Voidlight_Lantern', 4.5, 180)], kinds=['road', 'royal'])
W('roadside', [('Watchtower_T1', 12, 14), ('Watchtower_T2', 12, 14)], kinds=['road'])
W('plaza', [('Farmers_Market_Cart', 6, 17), ('Rustic_Market_Stall', 6, 17), ('Enchanted_Blossom_Tea', 9, 8)])
W('coast', [('Untitled_3', 18, 10), ('Untitled_4', 14, 10), ('Tiki_Pavilion', 14, 8), ('Untitled_5', 20, 6)], away=300)
W('sea', [('Castle_Boat_Diorama', 55, 6)])
# ---- the sky: floating isles all over, big sky citadels, a cluster over the Sky Isles
sky_all = dict(centre=[-700, 2260], r=9000, alt=[260, 900])
W('sky', [('Floating_Isle_of_Biol', 80, 4), ('Floating_Isle_of_Blos', 60, 4), ('Floating_Paradise', 60, 5), ('Floating_Island_Farm', 60, 3), ('Ethereal_Crystal_Isla', 60, 4),
  ('Embercrest_Island', 80, 3), ('Magical_floating_isla', 80, 4), ('Logic_Island_The_For', 100, 3), ('_garden_floating_ga', 45, 4), ('_garden_floating_ga_2', 45, 4),
  ('Rocky_Island_Plateau', 80, 4), ('Skyward_Ascent_Flying', 70, 5), ('The_object_is_a_float', 120, 3), ('Treehouse_Island', 45, 3), ('Void_Castle_Island', 55, 2),
  ('Floating_Shelves_Form', 40, 3), ('_Greece_A_floating_i', 26, 2)], **sky_all)
W('sky', [('Skybound_Citadel', 160, 1), ('Skyborne_Citadel', 170, 1), ('Celestial_Citadel_of_', 240, 1), ('Azure_Citadel_of_the_', 220, 1), ('Celestial_Golden_Cita', 160, 1),
  ('Archipelago_of_Innova', 300, 1), ('Skybound_Isles', 260, 1), ('A_fantasy_city_with_t', 150, 1), ('Celestial_Citadel', 260, 1)], centre=[-700, 2260], r=8500, alt=[700, 1500])
W('sky', [('Floating_Paradise', 60, 4), ('Rocky_Island_Plateau', 70, 4), ('_garden_floating_ga', 45, 4), ('Skyward_Ascent_Flying', 60, 4), ('Floating_Shelves_Form', 40, 4)], centre=[-5500, 4125], r=1100, alt=[150, 600], place='B30')
W('sky', [('Floating_Ice_Castle_I', 90, 2), ('Glowing_Ice_Castle_Is', 90, 2), ('Yuki', 14, 6)], centre=[2043, -4010], r=1500, alt=[200, 700])
W('sky', [('Lava_Castle_Island', 80, 2)], centre=[4983, -2060], r=1500, alt=[300, 800])
# ---- the great ridge: far landmarks on its foothills and ledges
W('ridge', [('Emberfall_Citadel', 150, 2), ('Crystal_Vanguard_Cita', 110, 2), ('Ivory_Spire_Citadel', 120, 2), ('Azure_Crystal_Citadel', 130, 2), ('Azure_Dome_Palace', 90, 2),
  ('Blue_Core_Citadel', 90, 2), ('A_massive_tall_scie_3', 150, 2), ('Violet_Sanctum_of_the', 80, 2), ('The_Cascading_Citadel', 90, 2), ('Emerald_Palace_with_G', 60, 2),
  ('St_Petersbourg_chess', 50, 1), ('Devils_Tower', 320, 5), ('Crystal_Citadel', 110, 2), ('Citadel_of_the_Clouds', 300, 2), ('Prismatic_Citadel', 70, 2),
  ('Palace_of_the_Four_Do_2', 70, 1), ('Gardenspire_Citadel', 110, 2), ('Sapphire_Grove_Citade', 40, 3), ('Winding_Stone_Tower', 30, 6), ('Untitled_2', 40, 4)], hmin=120, hmax=2600, smax=0.6)
miss = sorted({e['m'] for e in I if e['m'] not in have}); I = [e for e in I if e['m'] in have]
json.dump(dict(items=I), open(S+'/ridge/plan_new.json', 'w'), indent=0)
print(len(I), 'entries', sum(e['n'] for e in I), 'instances; missing', miss)
