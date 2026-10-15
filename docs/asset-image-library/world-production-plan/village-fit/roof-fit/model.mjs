// Proposed roof construction variant. The source village and its collision model are immutable.
export function createRoofStudy(village) {
 const slope=2.8/3,roofY=x=>5.2+(x<=21?x-18:24-x)*slope;
 const shaft={id:'VENT-SHAFT-P01',x:19.95,z:-12,outer:.55,bore:.21,top:8.1,baseAt:x=>roofY(x)-.15};
 const penetration={id:'RF01',kind:'roof_vent',host_ids:['H-N-18-ROOF-0','H-N-18-ROOF-1'],xmin:shaft.x-.325,xmax:shaft.x+.325,zmin:shaft.z-.325,zmax:shaft.z+.325,clearance_m:.05,destination:'Unoccupied loft air to exterior; no hearth or combustion system',construction:'Proposed exact parametric rectangular roof subtraction; not an approved Blender Boolean'};
 const valley={id:'VALLEY-DRAIN-P01',x:24,slot_half:.16,wing_half:.32,rear:-15.25,front:-5.65,rear_y:5.08,grade:.01,wall_cap_y:4.9,scupper_half:.35,thickness:.012};
 valley.floorAt=z=>valley.rear_y-(z-valley.rear)*valley.grade;
 valley.surfaceAt=(x,z)=>valley.floorAt(z)+Math.abs(x-valley.x)/valley.wing_half*(5.2+valley.wing_half*slope-.01-valley.floorAt(z));
 const valleyCut={id:'RF02',kind:'open_valley',xmin:23.84,xmax:24.16,zmin:-16,zmax:-5,destination:'Front downpipe and at-grade inspection sump'};
 const cuts=[penetration,valleyCut];
 const roofs=village.roofs.filter(r=>/^H-N-(18|24)-ROOF-/.test(r.id)).map(r=>({...r,cuts}));
 const sourceWalls=village.walls.filter(w=>/^H-N-(18|24)-/.test(w.id));
 const walls=[];
 for(const w of sourceWalls){
  if(w.base!==2.6){walls.push({...w});continue;}
  if(w.axis==='z'&&w.at===24){walls.push({...w,height:valley.wall_cap_y-w.base,variant:'Party-wall cap lowered beneath channel; ground room unchanged'});continue;}
  if(w.axis!=='x'||![-6,-15].includes(w.at)){walls.push({...w});continue;}
  const xs=[w.start,w.end,23.65,24.35].filter(x=>x>=w.start&&x<=w.end).sort((a,b)=>a-b);
  const unique=[...new Set(xs)];
  for(let i=1;i<unique.length;i++){
   const start=unique[i-1],end=unique[i],notch=(start+end)/2>23.65&&(start+end)/2<24.35;
   walls.push({...w,id:w.id+'-RF-'+i,start,end,height:notch?valley.wall_cap_y-w.base:w.height,opening_ids:w.opening_ids.filter(id=>{const o=village.openings.find(o=>o.id===id);return o.centre>start&&o.centre<end;}),variant:notch?'Front/rear scupper notch':'Source wall retained'});
  }
 }
 const gables=village.gables.filter(g=>/^H-N-(18|24)-/.test(g.id)).map(g=>({...g,clip_min:g.x===24?24.35:g.x,clip_max:g.x===18?23.65:g.x+g.span}));
 const rafters=[-.45,.45].map((dz,i)=>({id:'VENT-RAFTER-'+i,xmin:18,xmax:21,zmin:shaft.z+dz-.09,zmax:shaft.z+dz+.09}));
 const pot={id:'MOUNTED-D09',part:'D09',asset_id:'B12-DETAIL-001-D09',position:[shaft.x,shaft.top,shaft.z],rotation:[0,0,0],support:'Shaft crown seat at Y 8.1 m; matching 0.21 m continuous bore',status:'Mounted Function specimen; final art and structure pending'};
 const pipe={id:'DOWNPIPE-P01',x:24,z:valley.front+.035,outer:.14,bore:.10,bottom:.22,top:valley.floorAt(valley.front)-.03};
 const endpoints={roof_start:[23.45,5.2+.55*slope,-13.5],valley_entry:[24,valley.floorAt(-13.5),-13.5],valley_exit:[24,valley.floorAt(valley.front),valley.front],drop:[24,valley.floorAt(valley.front)-.02,pipe.z],pipe_end:[24,.22,pipe.z],sump:[24,-.12,pipe.z]};
 const flow=[endpoints.roof_start,[23.84,roofY(23.84),-13.5],[23.842,valley.surfaceAt(23.842,-13.5),-13.5],endpoints.valley_entry,endpoints.valley_exit,endpoints.drop,endpoints.pipe_end,endpoints.sump];
 const scuppers=[{id:'RF03-FRONT',x:24,z:-6,width:.7,base:4.9,height:.7},{id:'RF03-REAR',x:24,z:-15,width:.7,base:4.9,height:.7}];
 return {id:'B12-ROOF-JOINS-FIT-001',village,shaft,roofY,penetration,valley,cuts,roofs,walls,gables,rafters,pot,pipe,flow,scuppers,
  source_unchanged:true,units:'metres',purpose:'Geometry, attachment and downward drainage review; not construction certification or final art',
  exceptions:['D09 uses the saved 0.35 × 0.35 × 0.6 m pot; the shaft, framing, flashing and drainage pieces are proposed hidden construction.',
   'The lightweight clad shaft is a passive loft vent in this prototype. No fireplace, heating, smoke or fire-safe flue specification is implied.',
   'Only the two north-row roof assemblies are revised here. The baseline village page remains a separate earlier fixture.',
   'Roof repeats retain 6 m span, 3 m length and 2.8 m rise. RF01 crosses a repeat seam; both hosts and the backing straps are cut.',
   'The valley is a sloped open channel with party-wall cap and end-wall scupper notches, rather than a flat solid trim bar.',
   'A hollow downpipe ends at an actual open inspection sump. The onward site drain remains unresolved; this is not a complete stormwater network.',
   'The source open pot admits rain. Its rain cowl/condensate arrangement, fire specification, weather seals and fabrication tolerances remain unresolved.',
   'Flow markers are a deterministic geometric trace, not a fluid simulation, waterproofing test, discharge-capacity calculation or structural approval.']};
}
