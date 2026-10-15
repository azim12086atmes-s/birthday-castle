// Deterministic placement envelopes, not accepted flora meshes or simulated fauna.
export function createForestHabitats(geo,proposal,{nearLine,distance,smooth}) {
  const f=proposal.forest_sample,paths=[f.loop,f.entry_spur],objects=[];
  const pathDistance=(x,z)=>Math.min(...paths.map(p=>nearLine([x,z],p).d));
  function zoneAt(x,z) {
    const wet=geo.forest.water(x,z),r=Math.hypot((x-35)/12,(z-22)/8);
    if(geo.forest.bridgeContains(x,z))return {id:'H02',name:'Bridge deck',color:'#b69e73'};
    if(wet)return {id:'H05',name:wet.kind==='pond'?'Test pond':'Rill',color:'#7daeb7'};
    if(pathDistance(x,z)<1.5)return {id:'H02',name:'Compacted trail',color:'#c4b593'};
    if(r<1.4||nearLine([x,z],f.rill.points).d<3.3)return {id:'H05',name:'Wet bank',color:'#a7a88b'};
    if(Math.abs(x)<12&&Math.abs(z)<11)return {id:'H01',name:'Cottage yard',color:'#bcba97'};
    if(pathDistance(x,z)<4)return {id:'H02',name:'Short trail verge',color:'#b0b18b'};
    if(Math.hypot(x,z)>55)return {id:'H06',name:'Outer leaf litter',color:'#7d9572'};
    if(x<0&&z<20)return {id:'H03',name:'Shaded moss hollow',color:'#829d75'};
    return {id:'H04',name:'Sunny meadow',color:'#acb784'};
  }
  let seed=5052026;
  const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
  const specs=[
    {kind:'broadleaf',count:15,radius:.3,height:[12,17],crown:[3,4.4],block:true,reference:'GEN-09 (canopy family audit pending)'},
    {kind:'birch',count:9,radius:.2,height:[10,15],crown:[2.2,3.1],block:true,reference:'GEN-09 (canopy family audit pending)'},
    {kind:'sapling',count:10,radius:.14,height:[2.5,4],crown:[.7,1.1],block:true,reference:'GEN-09'},
    {kind:'shrub',count:16,radius:.45,height:[.6,.9],block:true,reference:'F02-NATURE-001-A09'},
    {kind:'rock',count:10,radius:.8,height:[.4,1.1],block:true,reference:'GEN-09 (rock family audit pending)'},
    {kind:'bluebell',count:10,radius:.225,height:[.3,.45],block:false,reference:'F02-NATURE-001-A10'},
    {kind:'strawberry',count:8,radius:.2,height:[.15,.3],block:false,reference:'F02-NATURE-001-A11'},
    {kind:'deadwood',count:4,radius:1.5,height:[.35,.5],block:true,reference:'F02-NATURE-001-A01'},
  ];
  for(const spec of specs) {
    let accepted=0;
    for(let attempt=0;accepted<spec.count&&attempt<2500;attempt++) {
      const x=(random()-.5)*140,z=(random()-.5)*140,r=spec.radius;
      if(Math.hypot(x,z)>72-r||Math.hypot(Math.max(0,Math.abs(x)-6),Math.max(0,Math.abs(z)-4.5))<7+r)continue;
      if(pathDistance(x,z)<2.3+r||geo.forest.water(x,z))continue;
      const pond=Math.hypot((x-35)/12,(z-22)/8);
      if(pond<1.35||nearLine([x,z],f.rill.points).d<3+r)continue;
      if(['broadleaf','birch'].includes(spec.kind)&&Math.hypot(x,z)<46)continue;
      if(spec.block&&objects.some(o=>o.block&&distance([x,z],[o.x,o.z])<r+o.radius+.5))continue;
      const height=spec.height[0]+random()*(spec.height[1]-spec.height[0]);
      const crown=spec.crown?spec.crown[0]+random()*(spec.crown[1]-spec.crown[0]):r;
      if(spec.kind==='sapling'&&pathDistance(x,z)<crown+2.3)continue;
      objects.push({id:`FC05-${spec.kind.toUpperCase()}-${++accepted}`,kind:spec.kind,x,z,y:geo.forest.height(x,z),radius:r,height,crown_radius:crown,crown_base_m:spec.kind==='sapling'?1.8:Math.max(3,height*.3),block:spec.block,zone:zoneAt(x,z).id,reference:spec.reference,status:'Placement envelope; reference-to-model identity and final shape pending'});
    }
    if(accepted!==spec.count)throw Error(`Placement budget not met: ${spec.kind} ${accepted}/${spec.count}`);
  }
  for(let i=0;i<12;i++) {
    const a=i/12*Math.PI*2,x=35+12.3*Math.cos(a),z=22+8.3*Math.sin(a);
    if(pathDistance(x,z)<2.3)continue;
    objects.push({id:`FC05-REED-${i+1}`,kind:'reed',x,z,y:geo.forest.height(x,z),radius:.4,height:1.1,crown_radius:.4,block:false,zone:'H05',reference:'GEN-09',status:'Wet-bank placement envelope; not a final reed model'});
  }
  const faunaStations=[
    {id:'OBS-01',name:'Pond-edge observation',point:[22,22],proposed_visitors:['frog','dragonfly'],reference:'F02-FAUNA-002'},
    {id:'OBS-02',name:'Shaded woodland observation',point:[-35,-20],proposed_visitors:['woodland bird','squirrel'],reference:'F02-FAUNA-001 / F02-FAUNA-002'},
    {id:'OBS-03',name:'Sunny verge observation',point:[26,-25],proposed_visitors:['butterfly','bee'],reference:'F02-FAUNA-002'},
  ];
  for(const station of faunaStations){station.focus_point=[...station.point];const n=nearLine(station.point,f.loop),a=f.loop[n.index],b=f.loop[n.index+1];station.point=[a[0]+n.t*(b[0]-a[0]),a[1]+n.t*(b[1]-a[1])];station.status='Proposed observation point on the existing loop; no fauna model or encounter behavior';}
  const blocked=(x,z,r=.45)=>objects.some(o=>o.block&&distance([x,z],[o.x,o.z])<r+(o.kind==='sapling'?o.crown_radius:o.radius));
  function relief(x,z) {
    const d=pathDistance(x,z),yard=Math.hypot(Math.max(0,Math.abs(x)-6),Math.max(0,Math.abs(z)-4.5));
    const hill=(cx,cz,rx,rz,h)=>h*Math.exp(-(((x-cx)/rx)**2+((z-cz)/rz)**2)*2);
    return (hill(-28,-25,16,20,.9)+hill(30,-20,20,15,1.4)+hill(-44,30,15,18,.8)-hill(-22,12,18,12,.35))*smooth(5,14,d)*smooth(10,20,yard);
  }
  return {objects,faunaStations,pathDistance,zoneAt,blocked,relief,seed:5052026};
}
