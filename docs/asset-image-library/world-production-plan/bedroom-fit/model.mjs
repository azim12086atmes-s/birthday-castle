import {length,resample,segment} from '../blockout/geography.mjs';
export const playerContract={radius:.45,height:1.75,eye:1.6,max_step:.2,sweep:.04};
export const vaultHeight=x=>12.6+5.4*Math.pow(Math.max(0,1-Math.abs(x)/12.4),.65);
export const apertureTop=(o,u)=>Math.abs(u-o.centre)>o.width/2+1e-8?-Infinity:o.sill+o.height-o.rise+o.rise*Math.pow(Math.max(0,1-Math.abs(u-o.centre)/(o.width/2)),.65);
export function apertureOutline(o,n=64){const ps=[[o.centre-o.width/2,o.sill],[o.centre+o.width/2,o.sill]];for(let i=0;i<=n;i++){const u=o.centre+o.width/2-i/n*o.width;ps.push([u,apertureTop(o,u)]);}return ps;}

export function createBedroom(source,proposal,geo){
 const sourceRoom=proposal.bedroom_sample,items=[],add=(id,kind,reference_id,position,dimensions,extra={})=>items.push({id,kind,reference_id,position,dimensions,rotation:0,layer:'floor',attachment:'Underside on floor',...extra});
 const b=sourceRoom.bed;add('BED-FRAME','bed','INT-SUITE-FURN-001-S01',[b.centre[0],0,b.centre[1]],[b.width_m,b.depth_m,b.height_m],{solid:true,front:'South; headboard north'});
 add('MATTRESS','mattress','INT-BED-DRESS-001-A01',[0,.48,-6.5],[2,2.2,.28],{attachment:'Underside on slat deck Y=0.48'});
 add('FITTED-SHEET','sheet','INT-BED-DRESS-001-A02',[0,.48,-6.5],[2,2.2,.29],{attachment:'Thin hollow shell around mattress; no duplicate solid mattress'});
 add('BLUSH-DUVET','duvet','INT-BED-DRESS-001-A03',[0,.77,-6.35],[2.4,2.5,.08],{attachment:'Centre on sheet; posed side folds hang over mattress',posed:true});
 for(const x of [-.48,.48])add('PILLOW-'+x,'pillow','INT-BED-DRESS-001-A04',[x,.77,-7.23],[.7,.45,.16],{attachment:'Underside on fitted-sheet top'});
 for(const x of [-1.05,1.05])for(const z of [-7.8,-5.2])add(`CANOPY-CURTAIN-${x}-${z}`,'canopy-curtain','INT-BED-DRESS-001-A05',[x,.15,z],[.9,.03,2.3],{attachment:'Visible header rings meet frame; gathered fabric near each post',posed:true});
 for(const z of [-7.8,-5.2])add('VALANCE-'+z,'valance','INT-BED-DRESS-001-A06',[0,2.45,z],[2.2,.06,.32],{attachment:'Header on canopy beam'});
 for(const x of [-1.05,1.05])add('SIDE-VALANCE-'+x,'valance','INT-BED-DRESS-001-A07',[x,2.45,-6.5],[2.7,.06,.32],{rotation:Math.PI/2,attachment:'Header on side canopy beam'});
 for(const x of [-1.08,1.08])add('SIDE-SKIRT-'+x,'skirt','INT-BED-DRESS-001-A08',[x,.08,-6.5],[2.7,.02,.4],{rotation:Math.PI/2,attachment:'Header on frame side rail'});
 add('FOOT-SKIRT','skirt','INT-BED-DRESS-001-A09',[0,.08,-5.17],[2.2,.02,.4],{attachment:'Header on foot rail'});
 add('FOOT-RUNNER','runner','INT-BED-DRESS-001-A10',[0,.85,-5.65],[2.3,.55,.015],{attachment:'Broad centre rests on duvet; posed overhangs',posed:true});
 for(const x of [-1.8,1.8])add('BEDSIDE-'+x,'cabinet','INT-SUITE-FURN-001-S02',[x,0,-7.05],[.65,.45,.75],{solid:true,front:'South'});
 add('WARDROBE-NW','wardrobe','INT-SUITE-FURN-001-S03',[-9,0,-8.1],[1.6,.65,2.4],{solid:true,front:'South'});
 add('DRESSING-TABLE','dressing-table','INT-SUITE-FURN-001-S04',[-10.75,0,-6.6],[1.4,.5,.8],{rotation:Math.PI/2,solid:true,front:'East'});
 add('MOON-MIRROR','mirror','GEN-24-A03',[-11.96,1.05,-6.6],[.9,.08,1.2],{rotation:Math.PI/2,attachment:'Rear plate against west inner wall',front:'East',proposed_dimensions:true});
 for(const i of sourceRoom.furnishings){const kind=i.id.startsWith('CHAIR')?'chair':i.id.startsWith('TABLE')?'table':i.id.startsWith('FOUNTAIN')?'fountain':i.id.startsWith('CHAISE')?'chaise':'console';
  const rotation=kind==='chair'?Math.atan2(-28-i.centre[0],-1-i.centre[1]):0;
  add(i.id,kind,{chair:'INT-R02-S01',table:'GEN-24-A06',fountain:'INT-R02-S01',chaise:'GEN-24-A05',console:'GEN-24-A04'}[kind],[i.centre[0],0,i.centre[1]],[i.width_m,i.depth_m,i.height_m],{rotation,solid:true,source_placement:'Unchanged existing blockout furnishing reservation',front:kind==='chair'?'Toward balcony table':kind==='chaise'?'North toward room':'Source-family fit',proposed_dimensions:true});
 }
 add('KEEPSAKE-CASKET','casket','INT-BEDROOM-PROP-001-A01',[8,.85,6],[.28,.18,.16],{attachment:'Base on console top Y=0.85',interaction:'E opens/closes within 1.8 m'});
 add('KEEPSAKE-LOCKET','locket','INT-BEDROOM-PROP-001-A09',[8,.875,6],[.035,.045,.008],{attachment:'Broad face flat on casket interior base; source vertical oval rotated onto support',source_dimensions:[.035,.008,.045]});
 for(const [x,size]of [[4.2,.35],[4.7,.28]])add('GIFT-'+x,'gift','GEN-25-A03',[x,0,-7.7],[size,size,size],{solid:true,proposed_dimensions:true,attachment:'Underside on floor; modest birthday dressing'});
 add('PERFUME','bottle','INT-BEDROOM-PROP-001-A02',[-10.75,.8,-6.6],[.08,.06,.16],{attachment:'Base on dressing table Y=0.80'});
 add('BED-RUG','rug','GEN-24-A11',[0,0,-3.5],[3.6,2.4,.012],{walkable:true,proposed_dimensions:true});
 add('READING-RUG','rug','GEN-24-A11',[-8,0,5],[3,2,.012],{walkable:true,proposed_dimensions:true});
 const chaise=items.find(i=>i.id==='CHAISE-SW');chaise.position[1]=.012;chaise.attachment='Feet on reading-rug top Y=0.012; original X/Z reservation and furniture dimensions retained';
 // Flower pots and tied privacy curtains stay outside the eight-metre opening.
 for(const z of [-5.7,3.7])add('PORTAL-CURTAIN-'+z,'privacy-curtain','GEN-24-A10',[-11.89,.15,z],[.55,.5,12.1],{solid:true,attachment:'Proposed plain extended body; source hem/tieback motif kept human-sized; header meets Y=12.25 rail',posed:true});
 for(const[x,z]of [[-17.8,-6.2],[-17.8,4.2],[-29,-5.5],[-29,3.5]])add(`ROSE-URN-${x}-${z}`,'rose-urn','INT-R02-S01',[x,0,z],[.65,.65,1.25],{solid:true,proposed_dimensions:true,front:'Planting upward'});
 add('CENTRAL-CHANDELIER','chandelier','GEN-24-A07',[0,4.8,0],[2.4,2.4,2.4],{layer:'ceiling',attachment:'Visible chain from body top Y=7.2 to vault underside Y=18',proposed_dimensions:true});
 for(const x of [-4,4])add('NORTH-SCONCE-'+x,'sconce','INT-R02-S01',[x,2.05,-9],[.3,.3,.65],{attachment:'Rear face meets north inner wall',proposed_dimensions:true});
 const walls=[
  {id:'W-N',axis:'x',at:-9.2,start:-12.4,end:12.4,depth:.4,vault_end:true},
  {id:'W-S',axis:'x',at:9.2,start:-12.4,end:12.4,depth:.4,vault_end:true},
  {id:'W-E',axis:'z',at:12.2,start:-9.2,end:9.2,depth:.4,height:12.6},
  {id:'W-W',axis:'z',at:-12.2,start:-9.2,end:9.2,depth:.4,height:12.6}
 ];
 walls.push({id:'NICHE-FRONT',axis:'x',at:-7.9,start:-2.4,end:2.4,depth:.2,height:6},...[-2.3,2.3].map(x=>({id:'NICHE-SIDE-'+x,axis:'z',at:x,start:-9,end:-7.8,depth:.2,height:6})));
 const openings=[{id:'N-BED-ALCOVE',wall_id:'NICHE-FRONT',axis:'x',at:-7.9,centre:0,width:3.8,sill:.15,height:5,rise:2,kind:'deep_alcove',traversable:false,destination:'Backed bed-head recess; not a doorway',face_sign:1,usable_depth_m:1.2,back_wall_id:'W-N',reference_id:'INT-SUITE-SHELL-001-S01'},{id:'S-ENTRY',wall_id:'W-S',axis:'x',at:9.2,centre:0,width:2.4,sill:0,height:3.2,rise:.8,kind:'door',traversable:true,destination:'South entrance apron / bedroom',face_sign:-1},
  {id:'W-BALCONY',wall_id:'W-W',axis:'z',at:-12.2,centre:-1,width:8,sill:0,height:12,rise:4,kind:'door',traversable:true,destination:'Open west threshold neck and circular flower balcony',face_sign:1},
  ...[-5,0,5].map(z=>({id:'E-WINDOW-'+z,wall_id:'W-E',axis:'z',at:12.2,centre:z,width:3,sill:1,height:9,rise:2.5,kind:'window',traversable:false,destination:'Exterior view / coloured glazing',face_sign:-1,proposed_dimensions:true}))];
 // Trim the rail exactly at the neck sides, then continue along those sides to the room.
 const R=sourceRoom.balcony.rail_radius_m,half=4,theta=Math.asin(half/R),cx=-23,cz=-1,joinX=cx+Math.sqrt(R*R-half*half),rails=[];
 const arc=Array.from({length:193},(_,i)=>{const a=theta+(Math.PI*2-2*theta)*i/192;return[cx+R*Math.cos(a),cz+R*Math.sin(a)];});
 const rail_planters=[];for(let i=5;i<arc.length-5;i+=5){const[x,z]=arc[i],a=Math.atan2(z+1,x+23);rail_planters.push({id:'RAIL-FLOWER-'+i,reference_id:'INT-R02-S01',rail_anchor:[x,1.06,z],pot_base:[x+.15*Math.cos(a),.42,z+.15*Math.sin(a)],plate_top_y:.42,role:'Proposed pot and bracket on existing flower-rail vocabulary; final hardware/drainage pending'});}
 for(let i=1;i<arc.length;i++)rails.push({id:'ARC-'+i,a:arc[i-1],b:arc[i],kind:'curve',radius:R});
 for(const z of [-5,3])rails.push({id:'NECK-'+z,a:[joinX,z],b:[-12,z],kind:'straight'});
 const surface=(x,z)=>{if(!geo.bedroom.surface(x,z))return null;return items.some(i=>i.walkable&&inFootprint(i,x,z,0))?.012:0;};
 function inFootprint(i,x,z,r=0){const dx=x-i.position[0],dz=z-i.position[2],c=Math.cos(i.rotation),s=Math.sin(i.rotation),u=dx*c-dz*s,v=dx*s+dz*c;return Math.hypot(Math.max(0,Math.abs(u)-i.dimensions[0]/2),Math.max(0,Math.abs(v)-i.dimensions[1]/2))<r+1e-9;}
 function canStand(x,z,r=.45,height=1.75){
  if(!geo.canWalk('bedroom',x,z,r)||surface(x,z)===null)return false;
  if(rails.some(l=>segment([x,z],l.a,l.b).d<r+.10))return false;
  if(Math.abs(x)<12&&Math.abs(z)<9&&height+surface(x,z)>vaultHeight(x)-.12)return false;
  if(Math.hypot(x,z)<1.2+r&&height+surface(x,z)>4.8)return false;
  if(items.some(i=>i.solid&&inFootprint(i,x,z,r+.04)))return false;
  for(const w of walls){const across=w.axis==='x'?z:x,u=w.axis==='x'?x:z;if(Math.abs(across-w.at)>w.depth/2+r||u+r<w.start||u-r>w.end)continue;if(!openings.some(o=>o.wall_id===w.id&&o.traversable&&u-r>=o.centre-o.width/2&&u+r<=o.centre+o.width/2&&Math.min(apertureTop(o,u-r),apertureTop(o,u+r))>=height+surface(x,z)))return false;}
  return true;
 }
 function move(p,dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/playerContract.sweep));let travelled=0;for(let i=0;i<n;i++){const x=p.x+dx/n,z=p.z+dz/n;if(canStand(x,z)&&Math.abs(surface(x,z)-surface(p.x,p.z))<=.2){travelled+=Math.hypot(x-p.x,z-p.z);p.x=x;p.z=z;}}return travelled;}
 let casketOpen=false,lastUse=-Infinity;
 function interact(p,now=Date.now()){if(Math.hypot(p.x-8,p.z-6)>1.8||!canStand(p.x,p.z))return{ok:false,reason:'Move near the keepsake console in the southeast corner.'};if(now-lastUse<400)return{ok:false,reason:'The casket is still moving.'};lastUse=now;casketOpen=!casketOpen;return{ok:true,open:casketOpen,reference_id:'INT-BEDROOM-PROP-001-A01',message:casketOpen?'You open the rose keepsake casket.':'You close the keepsake casket.'};}
 const routes={bedroom:[[0,12],[0,5],[4,5],[4,-3],[2.7,-6.5],[2.7,-4],[4,-3],[4,3],[8,4.8],[4,3],[0,5],[0,12]],balcony:[[0,12],[0,2],[-8,2],[-10,-1],[-16,-1],[-23,-1],[-25.5,-1],[-25.5,-2.3],[-23,-1],[-20,0],[-18,-1],[-16,-1],[-10,-1],[-8,2],[0,2],[0,12]]};
 const auditRoute=ps=>{const p={x:ps[0][0],z:ps[0][1]};let travelled=0;for(const[x,z]of resample(ps,.1).slice(1)){const want=Math.hypot(x-p.x,z-p.z),got=move(p,x-p.x,z-p.z);travelled+=got;if(Math.abs(got-want)>1e-6)return{status:'blocked',position:{...p},expected:[x,z],travelled_m:travelled};}return{status:'pass',length_m:length(ps),travelled_m:travelled,position:p};};
 return{id:'B01-BEDROOM-FIT-001',sourceRoom,items,walls,openings,rails,rail_planters,rail_arc:arc,rail_join:{x:joinX,theta},contract:playerContract,surface,canStand,move,interact,routes,auditRoute,get casketOpen(){return casketOpen;},lights:[{id:'CENTRAL-LIGHT',fixture:'CENTRAL-CHANDELIER',position:[0,5.7,0],colour:'#ffe2b0',intensity:.4,distance:18},...[-4,4].map(x=>({id:'NORTH-LIGHT-'+x,fixture:'NORTH-SCONCE-'+x,position:[x,2.4,-8.7],colour:'#ffd6ad',intensity:.18,distance:8}))],
  limits:['Separate Function fixture using procedural source-family specimens; final art, registered models and game integration remain pending.',
   'The room remains 24×18 m with 18 m apex, 8×12 m open west arch, 8×4 m neck and 18 m round balcony; wall springline 12.6 m is proposed so the arch fits below the vault.',
   'Three east windows preserve their source centres; 3×9 m apertures, vault profile and structural wall thickness are proposed construction geometry, not recovered source measurements.',
   'The bed frame stays 2.2×2.7×2.8 m. Flat textile sizes are preserved in metadata; gathered/draped shapes are proposed, not cloth simulation or certified join fit.',
   'Balcony rail is trimmed at the actual neck intersection and continues along both neck edges. Supports below the balcony, drainage, structural loading and final rail engineering remain unresolved.',
   'Tall privacy curtains use a proposed plain fabric extension. Human-scale furniture, trim motifs and bedside objects are not enlarged to fill the room.',
   'Legacy GEN-24 furniture, chandelier and room decor lack measured dimensions; the existing sample reservations or explicit new fit dimensions control their specimens. Source detail fidelity remains to build.']};
}
