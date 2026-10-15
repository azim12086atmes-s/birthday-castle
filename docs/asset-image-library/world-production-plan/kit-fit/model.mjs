// Shared geometry contract. Rendering and movement consume the same dimensions.
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export function createKit(c) {
  const flights = [
    {id: 'FLIGHT-A', x: 0, z: 0, y: 0, yaw: 0},
    {id: 'FLIGHT-B', x: 1.4, z: -4.4, y: 1.5, yaw: Math.PI / 2},
  ];
  const decks = [
    {id: 'ARRIVAL', xmin: -2, xmax: 2, zmin: 0, zmax: 4, y: 0},
    {id: 'TURN-LANDING', xmin: -1.4, xmax: 1.4, zmin: -5.8, zmax: -3, y: 1.5},
    {id: 'UPPER-FLOOR', xmin: 4.4, xmax: 8.4, zmin: -6.4, zmax: -2.4, y: 3},
  ];
  const rectangles = [...decks,
    {id: 'FLIGHT-A', xmin: -1.4, xmax: 1.4, zmin: -3, zmax: 0},
    {id: 'FLIGHT-B', xmin: 1.4, xmax: 4.4, zmin: -5.8, zmax: -3},
  ];
  const local = (f, x, z) => ({
    u: (x - f.x) * Math.cos(f.yaw) + (z - f.z) * Math.sin(f.yaw),
    s: (x - f.x) * Math.sin(f.yaw) - (z - f.z) * Math.cos(f.yaw),
  });
  const world = (f, u, s) => ({
    x: f.x + u * Math.cos(f.yaw) + s * Math.sin(f.yaw),
    z: f.z + u * Math.sin(f.yaw) - s * Math.cos(f.yaw),
  });
  const contains = (r, x, z) => x >= r.xmin - 1e-8 && x <= r.xmax + 1e-8 && z >= r.zmin - 1e-8 && z <= r.zmax + 1e-8;
  function surface(x, z) {
    const found = decks.filter(r => contains(r, x, z)).map(r => ({id: r.id, y: r.y}));
    for (const f of flights) {
      const {u, s} = local(f, x, z);
      if (Math.abs(u) <= c.flight.width_m / 2 + 1e-8 && s >= -1e-8 && s <= c.flight.run_m + 1e-8) {
        const step = clamp(Math.floor((s + 1e-8) / c.flight.going_m) + 1, 1, c.flight.risers);
        found.push({id: f.id, y: f.y + step * c.flight.rise_m});
      }
    }
    return found.sort((a, b) => b.y - a.y)[0] || null;
  }
  function railBase(x, z) {
    const floor = surface(x, z);
    for (const f of flights) {
      const {u, s} = local(f, x, z);
      if (Math.abs(u) < c.flight.width_m / 2 + .001 && s >= 0 && s <= c.flight.run_m) {
        return f.y + Math.min(c.flight.total_rise_m, (s + c.flight.going_m) * c.flight.rise_m / c.flight.going_m);
      }
    }
    return floor?.y ?? 0;
  }
  // Extract only the exterior of the joined surfaces; sockets have no cross-rail.
  const xs = [...new Set(rectangles.flatMap(r => [r.xmin, r.xmax]))].sort((a,b) => a-b);
  const zs = [...new Set(rectangles.flatMap(r => [r.zmin, r.zmax]))].sort((a,b) => a-b);
  const guards = [];
  for (const r of rectangles) {
    const edges = [
      {a:[r.xmin,r.zmin], b:[r.xmax,r.zmin], inward:[0,1], cuts:xs},
      {a:[r.xmin,r.zmax], b:[r.xmax,r.zmax], inward:[0,-1], cuts:xs},
      {a:[r.xmin,r.zmin], b:[r.xmin,r.zmax], inward:[1,0], cuts:zs},
      {a:[r.xmax,r.zmin], b:[r.xmax,r.zmax], inward:[-1,0], cuts:zs},
    ];
    for (const edge of edges) {
      const horizontal = edge.a[1] === edge.b[1], axis = horizontal ? 0 : 1;
      const cuts = edge.cuts.filter(v => v >= edge.a[axis] && v <= edge.b[axis]);
      for (let i=1; i<cuts.length; i++) {
        const a=[...edge.a],b=[...edge.b]; a[axis]=cuts[i-1]; b[axis]=cuts[i];
        const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;
        if (surface(mx-edge.inward[0]*.001,mz-edge.inward[1]*.001)) continue;
        if (horizontal && a[1] === 4) continue; // Ground-level arrival, not an elevated drop.
        const offset=c.parapet.edge_offset_m;
        guards.push({id:`GUARD-${guards.length+1}`,a:a.map((v,j)=>v+edge.inward[j]*offset),b:b.map((v,j)=>v+edge.inward[j]*offset)});
      }
    }
  }
  function guardBays(guard) {
    const length=Math.hypot(guard.b[0]-guard.a[0],guard.b[1]-guard.a[1]),out=[];
    for(let start=0;start<length-1e-8;start+=c.parapet.repeat_m)out.push({start_m:start,length_m:Math.min(c.parapet.repeat_m,length-start),kind:length-start>=c.parapet.repeat_m-1e-8?'full-repeat':'end-infill'});
    return out;
  }
  function segmentDistance(x,z,a,b) {
    const dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);
    return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
  }
  const openingHeight = z => c.opening.apex_m - Math.abs(z-c.opening.centre_xz[1]) * (c.opening.apex_m-c.opening.clear_height_m)/(c.opening.clear_width_m/2);
  function canStand(x,z,r=c.player.radius_m,height=c.player.height_m) {
    const floor=surface(x,z); if (!floor) return false;
    for(let i=0;i<24;i++) {
      const a=i/24*Math.PI*2;
      if(!surface(x+r*Math.cos(a),z+r*Math.sin(a))) return false;
    }
    if(guards.some(g=>segmentDistance(x,z,g.a,g.b)<r+c.parapet.thickness_m/2-1e-8)) return false;
    const wall=c.opening;
    if(Math.abs(x-wall.centre_xz[0])<wall.wall_thickness_m/2+r) {
      const u=Math.abs(z-wall.centre_xz[1])+r;
      if(u>wall.clear_width_m/2 || floor.y+height>wall.floor_m+openingHeight(wall.centre_xz[1]+u)) return false;
    }
    return true;
  }
  function move(position,dx,dz) {
    let p={...position};
    const count=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06)); // Swept substeps prevent running through walls.
    for(let i=0;i<count;i++) {
      for(const [x,z] of [[p.x+dx/count,p.z+dz/count],[p.x+dx/count,p.z],[p.x,p.z+dz/count]]) {
        const a=surface(p.x,p.z),b=surface(x,z);
        if(canStand(x,z) && a && b && Math.abs(b.y-a.y)<=c.player.max_step_m+1e-7) {p={x,z};break;}
      }
    }
    return p;
  }
  const route=[{x:0,z:3},{x:0,z:-4.4},{x:7.3,z:-4.4},{x:0,z:-4.4},{x:0,z:3}];
  const modules=[...decks.map(d=>({id:d.id,family:d.id==='TURN-LANDING'?c.landing.id:c.floor.id,pivot:[(d.xmin+d.xmax)/2,d.y,(d.zmin+d.zmax)/2]})),...flights.map(f=>({id:f.id,family:c.flight.id,pivot:[f.x,f.y,f.z],yaw:f.yaw})),{id:'ARCH-WALL',family:c.opening.id,pivot:[c.opening.centre_xz[0],c.opening.floor_m,c.opening.centre_xz[1]],floor_m:c.opening.floor_m},...guards.map(g=>({id:g.id,family:c.parapet.id,pivot:[g.a[0],railBase(...g.a),g.a[1]]}))];
  return {contract:c,flights,decks,rectangles,guards,guardBays,modules,local,world,surface,railBase,canStand,move,openingHeight,route};
}
