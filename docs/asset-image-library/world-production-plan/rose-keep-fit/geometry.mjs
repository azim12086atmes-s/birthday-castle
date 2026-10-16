import * as THREE from '../../../../vendor/three.module.min.js';
export {THREE};
export function buildRose(m){
 const root=new THREE.Group(),layers={},objects=new Map(),materials=new Map();for(const n of['floors','walls','guards','supports','markers']){layers[n]=new THREE.Group();root.add(layers[n]);}
 const colour={ivory:'#e6ded1',rose:'#d2a5a1',trim:'#c2a66d',ground:'#d7d6ca',route:'#6f3d60',guard:'#ad9e8d'};
 const material=slot=>{if(!materials.has(slot))materials.set(slot,new THREE.MeshStandardMaterial({color:colour[slot],roughness:.85,side:THREE.DoubleSide}));return materials.get(slot);};
 const mesh=(id,g,slot,layer='floors')=>{const o=new THREE.Mesh(g,material(slot));o.name=id;layers[layer].add(o);objects.set(id,o);return o;};
 function box(id,x,y,z,w,h,d,slot='ivory',layer='floors'){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y+h/2,z);return mesh(id,g,slot,layer);}
 for(const d of m.decks)box(d.id,(d.xmin+d.xmax)/2,d.bottom,(d.zmin+d.zmax)/2,d.xmax-d.xmin,d.y-d.bottom,d.zmax-d.zmin,d.id==='TERRACE'?'rose':'ivory');
 for(let i=0;i<m.flight.risers;i++){const f=m.flight,h=(i+1)*f.rise_m;box(`TREAD-${i+1}`,f.x,f.y-.25,f.z-(i+.5)*f.going_m,f.width,h+.25,f.going_m,i%2?'rose':'ivory');}
 const foot=m.footing;box(foot.id,(foot.xmin+foot.xmax)/2,foot.bottom,(foot.zmin+foot.zmax)/2,foot.xmax-foot.xmin,foot.y-foot.bottom,foot.zmax-foot.zmin,'rose','supports');
 const t=m.decks.find(d=>d.id==='TERRACE');box('TERRACE-BASE',(t.xmin+t.xmax)/2,-.25,(t.zmin+t.zmax)/2,t.xmax-t.xmin,.25,t.zmax-t.zmin,'ground','supports');
 const o=m.doorway,w=m.walls[0],shape=new THREE.Shape(),ps=[[w.xmin,0],[o.x-o.width/2,0]];for(let i=0;i<=64;i++){const x=o.x-o.width/2+i/64*o.width;ps.push([x,m.archTop(x)-o.y]);}ps.push([o.x+o.width/2,0],[w.xmax,0],[w.xmax,w.height],[w.xmin,w.height]);ps.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 const wallGeometry=new THREE.ExtrudeGeometry(shape,{depth:w.zmax-w.zmin,bevelEnabled:false});wallGeometry.translate(0,w.y,w.zmin);mesh(w.id,wallGeometry,'rose','walls');
 const r=m.walls[1];box(r.id,(r.xmin+r.xmax)/2,r.y,(r.zmin+r.zmax)/2,r.xmax-r.xmin,r.height,r.zmax-r.zmin,'rose','walls');
 // A profile ring with an empty centre: same aperture samples as the wall substrate.
 const ring=new THREE.Shape(),band=[[o.x-1.6,0],[o.x-o.width/2,0],...Array.from({length:65},(_,i)=>{const x=o.x-o.width/2+i/64*o.width;return[x,m.archTop(x)-o.y];}),[o.x+o.width/2,0],[o.x+1.6,0],[o.x+1.6,3.2],...Array.from({length:65},(_,i)=>{const u=1.6-i/64*3.2;return[o.x+u,3.2+1.1*Math.pow(Math.max(0,1-Math.abs(u)/1.6),.65)];})];band.forEach(([x,y],i)=>i?ring.lineTo(x,y):ring.moveTo(x,y));ring.closePath();
 for(const[z,name]of[[w.zmin-.2,'D07-COURT'],[w.zmax,'D07-ARRIVAL']]){const g=new THREE.ExtrudeGeometry(ring,{depth:.2,bevelEnabled:false});g.translate(0,w.y,z);mesh(name,g,'ivory','walls');}
 // Independent colliders live in model.mjs. Switching off these specimens never removes containment.
 for(const guard of m.guards){const L=Math.hypot(guard.b[0]-guard.a[0],guard.b[1]-guard.a[1]),dx=(guard.b[0]-guard.a[0])/L,dz=(guard.b[1]-guard.a[1])/L,group=new THREE.Group();group.name=guard.id;layers.guards.add(group);
  for(let start=0,n=0;start<L-1e-8;start+=1,n++){const len=Math.min(1,L-start),a=[guard.a[0]+dx*start,guard.a[1]+dz*start],b=[a[0]+dx*len,a[1]+dz*len],ya=m.guardBase(...a),yb=m.guardBase(...b),base=.10,top=1.1,v=[];
   const normal=[-dz*.06,dx*.06],p=[];for(const [x,z,y]of[[a[0],a[1],ya],[b[0],b[1],yb]])for(const yy of[base,top])for(const sign of[-1,1])p.push([x+normal[0]*sign,y+yy,z+normal[1]*sign]);
   for(const ids of[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]])for(const i of[ids[0],ids[1],ids[2],ids[0],ids[2],ids[3]])v.push(...p[i]);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.computeVertexNormals();const panel=new THREE.Mesh(g,material(n%2?'ivory':'guard'));panel.name=`${guard.id}/${len<1-1e-8?'END-INFILL':'D05-REPEAT'}-${n}`;group.add(panel);
  }objects.set(guard.id,group);
 }
 const routeGroup=new THREE.Group();root.add(routeGroup);for(const [name,ps]of Object.entries(m.routes)){const points=[];for(let i=1;i<ps.length;i++){const a=ps[i-1],b=ps[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.04);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n;points.push(new THREE.Vector3(x,m.surface(x,z).y+.025,z));}}const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:name==='entrance'?'#794b64':'#507971'}));line.name=name;routeGroup.add(line);}
 // Ground board is context, never a navigable substitute for a missing module.
 box('CONTEXT-GROUND',0,-.35,-6,15,.1,25,'ground','supports');
 const human=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.12,.15,1.4,12),material('guard'));body.position.set(1.2,.7,2.3);human.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.175,12,8),material('guard'));head.position.set(1.2,1.575,2.3);human.add(head);layers.markers.add(human);
 const seams=new THREE.Group();root.add(seams);for(const id of['TERRACE','TOP-LANDING','ENTRANCE-WALL','RETURN-FOOTING']){const obj=objects.get(id);const helper=new THREE.Box3Helper(new THREE.Box3().setFromObject(obj),'#766b60');seams.add(helper);}
 function palette(on){for(const[slot,mat]of materials)mat.color.set(on?colour[slot]:({ivory:'#cbccc7',rose:'#b9bcb7',trim:'#8c918b',ground:'#e1e3dc',route:'#777777',guard:'#8b938b'}[slot]));}
 function counts(){let triangles=0,draws=0;root.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;draws++;}});return{triangles,mesh_draws:draws};}
 return{root,layers,objects,materials,routeGroup,seams,palette,counts};
}
