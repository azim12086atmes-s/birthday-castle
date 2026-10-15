import {regions,transitions,forestDistricts,forestZones} from './biome-config.mjs';
export function createBiomes(source,{inside,smooth,nearLine,distance}) {
  const land=source.water_and_coast.mainland_shoreline_xz_m,closed=[...land,land[0]];
  const gaussian=(x,z,cx,cz,rx,rz,h=1)=>h*Math.exp(-(((x-cx)/rx)**2+((z-cz)/rz)**2)*2);
  function weights(x,z) {
    const p=[x,z],shore=nearLine(p,closed).d;
    const woodland=Math.max(...source.forest_districts.map(f=>inside(p,f.polygon_xz_m)?1:1-smooth(0,350,nearLine(p,[...f.polygon_xz_m,f.polygon_xz_m[0]]).d)));
    const values=regions.filter(r=>r.id!=='T08').map(r=>{
      let weight=0;
      for(const b of source.landmarks.filter(b=>b.terrain_region_id===r.id)) {
        const radius=r.id==='T01'&&b.id==='B01'?1600:r.id==='T04'?750:r.id==='T06'?850:r.id==='T05'?800:r.id==='T07'?700:700;
        weight=Math.max(weight,gaussian(x,z,b.x_m,b.z_m,radius,radius,2.5));
      }
      if(r.id==='T02'){for(const [basin,boost]of [[source.water_and_coast.Lantern_Lake,1.8],[source.water_and_coast.Moonwater_basin,1]]){const [cx,cz]=basin.centre_xz_m,[w,h]=basin.approx_size_m,edge=Math.abs(Math.hypot((x-cx)/(w/2),(z-cz)/(h/2))-1)*Math.min(w,h)/2;weight=Math.max(weight,(1-smooth(60,300,edge))*boost);}}
      if(r.id==='T05')weight=Math.max(weight,woodland*2);
      if(r.id==='T03')weight=Math.max(weight,(1-smooth(80,650,shore))*1.3);
      if(r.id==='T01')weight+=.015; // Gentle meadow fallback instead of an undefined empty region.
      return {...r,weight};
    });
    const sum=values.reduce((a,r)=>a+r.weight,0);
    return values.map(r=>({...r,weight:r.weight/sum})).sort((a,b)=>b.weight-a.weight);
  }
  function relief(x,z) {
    // New landform proposals. Pads, water beds and shoreline attenuation are applied later.
    const north=gaussian(x,z,-300,-4100,1400,900,24);
    const west=gaussian(x,z,-4350,-1150,900,800,18);
    const mist=gaussian(x,z,3900,-3700,1100,1000,38);
    const saddle=-gaussian(x,z,2900,-2700,800,550,16);
    const jungle=gaussian(x,z,2600,1250,700,650,1)*(5*Math.sin(x/120)*Math.cos(z/145)-gaussian(x,z,2460,1120,250,180,9));
    const canyonEnvelope=gaussian(x,z,2200,2130,850,700);
    const gully=nearLine([x,z],[[1700,1800],[2050,2100],[2300,2470]]).d;
    const canyon=canyonEnvelope*(12-38*Math.exp(-((gully/150)**2)));
    const coast=1-smooth(100,550,nearLine([x,z],closed).d);
    const dunes=coast*3*(.5+.5*Math.sin(x/70+.5*Math.cos(z/160)));
    return north+west+mist+saddle+jungle+canyon+dunes;
  }
  return {regions,transitions,forestDistricts,forestZones,weights,relief};
}
