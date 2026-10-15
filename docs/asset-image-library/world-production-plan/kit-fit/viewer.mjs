import * as THREE from 'three';
import {createKit, clamp, distance} from './model.mjs';
const $ = id => document.getElementById(id);
try { await start(); } catch (error) {
  $('error').hidden=false; $('error').textContent=`Test could not start: ${error.message}`;
  window.kitError=String(error); console.error(error);
}
async function start() {
  const response=await fetch('contract.json'); if(!response.ok)throw Error('Contract failed to load');
  const contract=await response.json(), kit=createKit(contract), canvas=$('scene'), viewport=$('viewport');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#e3e7df');
  scene.add(new THREE.HemisphereLight('#fffdf0','#819084',2));
  const sun=new THREE.DirectionalLight('#fff9ed',2);sun.position.set(-4,12,6);scene.add(sun);
  const camera=new THREE.PerspectiveCamera(48,1,.03,150), ortho=new THREE.OrthographicCamera();
  const materials={
    ivory:new THREE.MeshStandardMaterial({color:'#c9cac4',roughness:.9}),
    rose:new THREE.MeshStandardMaterial({color:'#babeb7',roughness:.9}),
    metal:new THREE.MeshStandardMaterial({color:'#747e72',roughness:.65}),
    glass:new THREE.MeshStandardMaterial({color:'#9fa9a0',transparent:true,opacity:.5,roughness:.55,side:THREE.DoubleSide}),
  };
  const partBounds=new Map(), seams=new THREE.Group();scene.add(seams);
  const baseLine=new THREE.LineBasicMaterial({color:'#45574a'}), routeMaterial=new THREE.LineBasicMaterial({color:'#896644'});
  let view='orbit', orbit={theta:.7,phi:.86,radius:24,target:new THREE.Vector3(2.7,1.6,-1.6)}, position={...kit.route[0]},yaw=0,pitch=0;
  let selected=null, pointer=null, keys=new Set(), last=performance.now(), animation,auto=null, visited=[], stalled=0, maxY=0;
  let wall,highlight=null, walkingDistance=0;
  function meshBox(x,y,z,w,h,d,mat,group=scene) {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); mesh.position.set(x,y+h/2,z);group.add(mesh);return mesh;
  }
  function line(points,material=baseLine,parent=scene) {
    const mesh=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p))),material);parent.add(mesh);return mesh;
  }
  for(const deck of kit.decks) {
    const g=new THREE.Group();scene.add(g);
    meshBox((deck.xmin+deck.xmax)/2,deck.y-.25,(deck.zmin+deck.zmax)/2,deck.xmax-deck.xmin,.25,deck.zmax-deck.zmin,materials.ivory,g);
    partBounds.set(deck.id,new THREE.Box3().setFromObject(g));
    line([[deck.xmin,deck.y+.004,deck.zmin],[deck.xmax,deck.y+.004,deck.zmin],[deck.xmax,deck.y+.004,deck.zmax],[deck.xmin,deck.y+.004,deck.zmax],[deck.xmin,deck.y+.004,deck.zmin]],baseLine,seams);
  }
  for(const deck of kit.decks.filter(d=>d.y>0)) {
    for(const x of [deck.xmin+.3,deck.xmax-.3])for(const z of [deck.zmin+.3,deck.zmax-.3])
      meshBox(x,-.25,z,.3,deck.y,.3,materials.ivory);
  }
  for(const f of kit.flights) {
    const group=new THREE.Group();scene.add(group);
    const base=kit.world(f,0,contract.flight.run_m/2),beam=meshBox(base.x,f.y-.25,base.z,contract.flight.width_m,.25,contract.flight.run_m,materials.ivory,group);beam.rotation.y=-f.yaw;
    for(let j=0;j<contract.flight.risers;j++) {
      const p=kit.world(f,0,(j+.5)*contract.flight.going_m),h=(j+1)*contract.flight.rise_m;
      const m=meshBox(p.x,f.y,p.z,contract.flight.width_m,h,contract.flight.going_m,j%2?materials.ivory:materials.rose,group);m.rotation.y=-f.yaw;
    }
    partBounds.set(f.id,new THREE.Box3().setFromObject(group));
    const a=kit.world(f,-1.4,0),b=kit.world(f,1.4,0),c=kit.world(f,1.4,3),d=kit.world(f,-1.4,3);
    line([[a.x,f.y+.005,a.z],[b.x,f.y+.005,b.z]],baseLine,seams);
    line([[c.x,f.y+1.505,c.z],[d.x,f.y+1.505,d.z]],baseLine,seams);
  }
  // A closed extruded substrate profile with a genuine arch-shaped void.
  const o=contract.opening, shape=new THREE.Shape();
  const outline=[[-2,0],[-1.2,0],[-1.2,3.2],[0,3.8],[1.2,3.2],[1.2,0],[2,0],[2,4.2],[-2,4.2]];
  outline.forEach(([u,y],i)=>i?shape.lineTo(u,y):shape.moveTo(u,y));shape.closePath();
  const wallGeometry=new THREE.ExtrudeGeometry(shape,{depth:o.wall_thickness_m,bevelEnabled:false,steps:1});
  const wp=wallGeometry.attributes.position;
  for(let i=0;i<wp.count;i++) {const u=wp.getX(i),y=wp.getY(i),d=wp.getZ(i);wp.setXYZ(i,o.centre_xz[0]+d-o.wall_thickness_m/2,o.floor_m+y,o.centre_xz[1]+u);}
  // Swapping the extrusion/depth axes reflects the mesh; restore outward winding.
  for(let i=0;i<wp.count;i+=3){const a=[wp.getX(i+1),wp.getY(i+1),wp.getZ(i+1)],b=[wp.getX(i+2),wp.getY(i+2),wp.getZ(i+2)];wp.setXYZ(i+1,...b);wp.setXYZ(i+2,...a);}
  wallGeometry.computeVertexNormals();wall=new THREE.Mesh(wallGeometry,materials.ivory);scene.add(wall);partBounds.set('ARCH-WALL',new THREE.Box3().setFromObject(wall));
  const fill=[],caps=[],posts=[];
  function quad(out,a,b,c,d) {out.push(...a,...b,...c,...a,...c,...d);}
  function prism(out,a,b,width,height) {
    const len=Math.hypot(b[0]-a[0],b[2]-a[2]),nx=-(b[2]-a[2])/len*width/2,nz=(b[0]-a[0])/len*width/2;
    const v=[];for(const p of [a,b])for(const y of [-height/2,height/2])for(const s of [-1,1])v.push([p[0]+nx*s,p[1]+y,p[2]+nz*s]);
    for(const [i,j,k,l]of [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]])quad(out,v[i],v[j],v[k],v[l]);
  }
  for(const guard of kit.guards) {
    const n=Math.max(1,Math.ceil(Math.hypot(guard.b[0]-guard.a[0],guard.b[1]-guard.a[1])/.15)),points=[];
    for(let i=0;i<=n;i++) {const t=i/n,x=guard.a[0]+t*(guard.b[0]-guard.a[0]),z=guard.a[1]+t*(guard.b[1]-guard.a[1]);points.push([x,kit.railBase(x,z),z]);}
    for(let i=1;i<points.length;i++) {
      const a=points[i-1],b=points[i];quad(fill,[a[0],a[1]+.1,a[2]],[b[0],b[1]+.1,b[2]],[b[0],b[1]+1.07,b[2]],[a[0],a[1]+1.07,a[2]]);
      prism(caps,[a[0],a[1]+1.1,a[2]],[b[0],b[1]+1.1,b[2]],.14,.07);
    }
    const length=Math.hypot(guard.b[0]-guard.a[0],guard.b[1]-guard.a[1]),mounts=[...kit.guardBays(guard).map(b=>b.start_m),length];
    for(const mounting of mounts) {const t=mounting/length,x=guard.a[0]+t*(guard.b[0]-guard.a[0]),z=guard.a[1]+t*(guard.b[1]-guard.a[1]),floor=kit.surface(x,z).y,top=kit.railBase(x,z)+1.14;posts.push({x,z,y:floor,h:top-floor});}
    partBounds.set(guard.id,new THREE.Box3().setFromPoints(points.flatMap(p=>[new THREE.Vector3(...p),new THREE.Vector3(p[0],p[1]+1.14,p[2])])).expandByScalar(.08));
  }
  function batched(vertices,mat) {const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);scene.add(m);return m;}
  const glass=batched(fill,materials.glass);batched(caps,materials.metal);
  const postMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.12,1,.12),materials.metal,posts.length),dummy=new THREE.Object3D();
  posts.forEach((p,i)=>{dummy.position.set(p.x,p.y+p.h/2,p.z);dummy.scale.set(1,p.h,1);dummy.updateMatrix();postMesh.setMatrixAt(i,dummy.matrix);});scene.add(postMesh);
  const path=[];for(let i=1;i<kit.route.length;i++){const a=kit.route[i-1],b=kit.route[i],n=Math.ceil(distance(a,b)/.05);for(let j=0;j<=n;j++){const x=a.x+(b.x-a.x)*j/n,z=a.z+(b.z-a.z)*j/n;path.push([x,kit.surface(x,z).y+.02,z]);}}
  const routeLine=line(path,routeMaterial);
  // A 1.75 m ruler figure uses exactly the movement body's declared height.
  meshBox(1.25,0,2,.25,1.45,.22,materials.metal);const head=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8),materials.metal);head.position.set(1.25,1.6,2);scene.add(head);
  for(const m of kit.modules) {const option=document.createElement('option');option.value=m.id;option.textContent=`${m.id} · ${m.family}`;$('part').append(option);}
  function showPart() {
    selected=$('part').value||null;if(highlight){scene.remove(highlight);highlight.geometry.dispose();highlight.material.dispose();highlight=null;}
    if(selected){const bounds=partBounds.get(selected);highlight=new THREE.Box3Helper(bounds,0x996d3e);scene.add(highlight);orbit.target=bounds.getCenter(new THREE.Vector3());orbit.radius=Math.max(6,bounds.getSize(new THREE.Vector3()).length()*2);}
    const title=document.createElement('h2'),p=document.createElement('p');title.textContent=selected||'Joined circulation';
    p.textContent=selected?.startsWith('FLIGHT')?'Same 10-riser module, 1.5 m rise / 3 m run / 2.4 m clear; second instance rotates 90°. Bottom and top floor datums are distinct named sockets.':selected?.startsWith('GUARD')?'1.1 m minimum nominal guard above the nosing line; plain repeat host. Transparent infill is visual only; collision stays enabled.':selected==='ARCH-WALL'?'2.4 m wide / 3.2 m full-width headroom / 0.3 m deep true opening. The upper platform continues on both sides.':selected==='TURN-LANDING'?'2.8 × 2.8 m turning landing at Y 1.5 m. Both stair sockets remain free of cross-rails.':'Two copied flights connect to a landing and a 4 × 4 m upper floor. Contract dimensions are proposals; decorative models are not represented.';
    $('detail').replaceChildren(title,p);render();
  }
  function setView(value) {
    view=value;keys.clear();$('crosshair').hidden=view!=='walk';$('touch').hidden=view!=='walk';
    document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    $('help').textContent=view==='walk'?'WASD / arrows · Shift run · drag to look':view==='plan'?'True overhead from the same assembled meshes':'Drag to orbit · wheel to zoom';render();
  }
  function reset() {auto=null;stalled=0;maxY=0;visited=[];walkingDistance=0;position={...kit.route[0]};yaw=0;pitch=0;keys.clear();$('run').disabled=false;$('result').className='';$('result').textContent='At the lower apron. Ready for ascent, arch passage and return.';render();}
  function runReturn() {reset();auto={index:1};setView('walk');$('run').disabled=true;}
  function render() {
    const {width:w,height:h}=viewport.getBoundingClientRect();renderer.setSize(w,h,false);
    const floor=kit.surface(position.x,position.z);$('position').textContent=`${floor.id} · X ${position.x.toFixed(2)} / Z ${position.z.toFixed(2)} · floor Y ${floor.y.toFixed(2)} m`;
    camera.aspect=w/h;camera.updateProjectionMatrix();let active=camera;
    if(view==='plan') {const span=15;ortho.left=-span*w/h/2;ortho.right=span*w/h/2;ortho.top=span/2;ortho.bottom=-span/2;ortho.near=.1;ortho.far=100;ortho.position.set(3,30,-1);ortho.up.set(0,0,-1);ortho.lookAt(3,0,-1);ortho.updateProjectionMatrix();active=ortho;}
    else if(view==='walk') {camera.position.set(position.x,floor.y+contract.player.eye_height_m,position.z);camera.lookAt(position.x+Math.sin(yaw)*Math.cos(pitch),camera.position.y+Math.sin(pitch),position.z-Math.cos(yaw)*Math.cos(pitch));}
    else {camera.position.set(orbit.target.x+orbit.radius*Math.sin(orbit.phi)*Math.sin(orbit.theta),orbit.target.y+orbit.radius*Math.cos(orbit.phi),orbit.target.z+orbit.radius*Math.sin(orbit.phi)*Math.cos(orbit.theta));camera.lookAt(orbit.target);}
    renderer.render(scene,active);
    if(window.kitFit)window.kitFit.state={view,position:{...position},floor_y:floor.y,selected,auto:!!auto,max_y:maxY,visited:[...visited],walked_m:walkingDistance};
  }
  function tick(time) {
    const dt=Math.min(.05,(time-last)/1000);last=time;let dx=0,dz=0;
    if(auto) {
      const target=kit.route[auto.index],d=distance(position,target);
      if(d<.005) {
        const final=kit.move(position,target.x-position.x,target.z-position.z);walkingDistance+=distance(position,final);position=distance(final,target)<1e-7?{...target}:final;
        visited.push(auto.index);auto.index++;
        if(auto.index===kit.route.length){auto=null;$('run').disabled=false;$('result').className='pass';$('result').textContent=`PASS · climbed to ${maxY.toFixed(2)} m, passed the arch, returned · ${walkingDistance.toFixed(2)} m travelled.`;}
      } else {const speed=Math.min(contract.player.walk_mps*dt,d);dx=(target.x-position.x)/d*speed;dz=(target.z-position.z)/d*speed;yaw=Math.atan2(dx,-dz);}
    } else if(view==='walk') {
      const f=+(keys.has('KeyW')||keys.has('ArrowUp'))-+(keys.has('KeyS')||keys.has('ArrowDown')),r=+(keys.has('KeyD')||keys.has('ArrowRight'))-+(keys.has('KeyA')||keys.has('ArrowLeft'));
      if(f||r){const n=Math.hypot(f,r),speed=(keys.has('ShiftLeft')||keys.has('ShiftRight')?contract.player.run_mps:contract.player.walk_mps)*dt;dx=(Math.sin(yaw)*f+Math.cos(yaw)*r)/n*speed;dz=(-Math.cos(yaw)*f+Math.sin(yaw)*r)/n*speed;}
    }
    if(dx||dz) {const next=kit.move(position,dx,dz),travel=distance(position,next);walkingDistance+=travel;stalled=travel<1e-6?stalled+dt:0;position=next;maxY=Math.max(maxY,kit.surface(position.x,position.z).y);if(auto&&stalled>2){auto=null;$('run').disabled=false;$('result').className='fail';$('result').textContent='FAIL · movement was blocked before completing the return.';}}
    if(view==='walk'||auto)render();animation=requestAnimationFrame(tick);
  }
  $('part').onchange=showPart;
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{auto=null;$('run').disabled=false;setView(b.dataset.view);});
  $('reset').onclick=()=>{reset();orbit={theta:.7,phi:.86,radius:24,target:new THREE.Vector3(2.7,1.6,-1.6)};render();};$('run').onclick=runReturn;
  function updateMaterials() {
    const palette=$('palette').checked,colors={blue:'#537da6',rose:'#b87892',green:'#6a9981'};
    $('glass-color').disabled=!palette;materials.ivory.color.set(palette?'#eee4d1':'#c9cac4');materials.rose.color.set(palette?'#d3a2a4':'#babeb7');materials.metal.color.set(palette?'#b9914c':'#747e72');materials.glass.color.set(palette?colors[$('glass-color').value]:'#9fa9a0');glass.visible=$('glass').checked;routeLine.visible=$('route').checked;seams.visible=$('seams').checked;render();
  }
  for(const id of ['palette','glass','glass-color','route','seams'])$(id).onchange=updateMaterials;
  canvas.onpointerdown=e=>{pointer={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(!pointer)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer={x:e.clientX,y:e.clientY};if(view==='walk'){yaw+=dx*.005;pitch=clamp(pitch-dy*.005,-1.2,1.2);}else if(view==='orbit'){orbit.theta-=dx*.006;orbit.phi=clamp(orbit.phi+dy*.006,.1,1.48);}render();};
  canvas.onpointerup=canvas.onpointercancel=()=>pointer=null;
  canvas.addEventListener('wheel',e=>{e.preventDefault();if(view==='orbit')orbit.radius=clamp(orbit.radius*Math.exp(e.deltaY*.001),5,45);render();},{passive:false});
  addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName))return;keys.add(e.code);if(view==='walk'&&e.code.startsWith('Arrow'))e.preventDefault();});addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>keys.clear());
  document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();auto=null;$('run').disabled=false;keys.add(b.dataset.key);b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);});
  function geometryChecks() {
    scene.updateMatrixWorld(true);const ray=new THREE.Raycaster(new THREE.Vector3(5,4.6,-4.4),new THREE.Vector3(1,0,0)),clear=ray.intersectObject(wall).length===0;
    ray.set(new THREE.Vector3(5,4.6,-6.1),new THREE.Vector3(1,0,0));const sideHits=ray.intersectObject(wall),solid=sideHits.length>0;
    let triangles=0;scene.traverse(o=>{if(o.isMesh){const n=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;triangles+=n*(o.isInstancedMesh?o.count:1);}});
    return {actual_arch_passage_clear:clear,actual_wall_side_solid:solid,front_face_distance_m:sideHits[0]?.distance,front_face_normal_x:sideHits[0]?.face.normal.x,triangles,draw_calls:renderer.info.render.calls,budget:contract.rendering};
  }
  window.kitFit={ready:true,contract,kit,state:null,setView,reset,runReturn,geometryChecks,moveBy:(dx,dz)=>{position=kit.move(position,dx,dz);render();return {...position};},dispose:()=>{cancelAnimationFrame(animation);renderer.dispose();}};
  new ResizeObserver(()=>render()).observe(viewport);render();animation=requestAnimationFrame(tick);
}
