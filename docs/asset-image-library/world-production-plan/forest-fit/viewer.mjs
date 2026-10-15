import {createGeography,length,resample} from '../blockout/geography.mjs';
import {createForestCottage} from './model.mjs';
import {THREE,buildForestFixture} from './geometry.mjs';
const $=id=>document.getElementById(id),read=async p=>{const r=await fetch(p);if(!r.ok)throw Error(`${r.status} ${p}`);return r.json();};
try{
 const[source,proposal]=await Promise.all(['../blockout/source.json','../blockout/proposal.json'].map(read)),geo=createGeography(source,proposal),model=createForestCottage(source,proposal,geo),fixture=buildForestFixture(model,geo,proposal);
 const renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#c5cec1');scene.add(fixture.root,new THREE.HemisphereLight('#e7eddf','#555d45',2),new THREE.AmbientLight('#e5dfcf',.5));const sun=new THREE.DirectionalLight('#fff0d4',2);sun.position.set(-15,35,20);scene.add(sun);
 const perspective=new THREE.PerspectiveCamera(58,1,.05,500),ortho=new THREE.OrthographicCamera(-10,10,10,-10,.05,500);let camera=perspective;
 let mode='arrival',yaw=0,pitch=0,orbitYaw=.65,orbitPitch=.45,range=25,target=new THREE.Vector3(0,2,0),last=performance.now(),drag=null,run=null,plan=false,planLayer='lower';
 const player={x:0,z:7},keys=new Set(),state={mode,position:player,run:null,triangles:0,draw_calls:0};
 const marker=new THREE.Group();marker.visible=false;scene.add(marker);const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.035,5,48),new THREE.MeshBasicMaterial({color:'#eec373'}));ring.rotation.x=Math.PI/2;marker.add(ring);
 const original=new Map();fixture.root.traverse(o=>{if(o.isMesh)original.set(o,o.material);});
 const clayMaterial=new THREE.MeshStandardMaterial({color:'#d2d1c8',roughness:1,side:THREE.DoubleSide});
 // Reuse one clay material; toggling inspection does not accumulate GPU materials.
 function applyPalette(){const clay=$('palette').value==='clay'||plan;for(const[o,m]of original)o.material=clay?clayMaterial:m;}
 function layers(){fixture.groups.upper.visible=!plan;fixture.groups.vegetation.visible=$('plants').checked&&!plan;fixture.groups.terrain.visible=!plan;fixture.groups.water.visible=!plan;fixture.groups.trail.visible=!plan;fixture.groups.bridge.visible=!plan;fixture.groups.furniture.visible=$('furniture').checked;fixture.groups.shell.visible=!(plan&&planLayer==='ceiling');fixture.groups.doors.visible=!(plan&&planLayer==='ceiling');fixture.groups.ceiling.visible=!(plan&&planLayer==='lower');
  // The reflected-ceiling projection uses actual slab and suspended fixtures only.
  for(const item of model.room.items)fixture.objects.get(item.id).visible=!plan||(planLayer==='ceiling'?item.kind==='chime':item.kind!=='chime');
  for(const child of fixture.groups.furniture.children)if(child.isPointLight)child.visible=!plan;
  applyPalette();
 }
 function view(name){mode=name;state.mode=name;run=null;state.run=null;plan=['plan','ceiling'].includes(name);planLayer=name==='ceiling'?'ceiling':'lower';camera=plan?ortho:perspective;marker.visible=false;
  if(name==='arrival'){player.x=0;player.z=7;orbitYaw=.65;orbitPitch=.45;range=25;target.set(0,2,0);}
  if(name==='clearing'){orbitYaw=.45;orbitPitch=.92;range=148;target.set(0,0,0);}
  if(name==='room'){player.x=2;player.z=1;yaw=.9;pitch=.04;}
  if(name==='walk'){player.x=0;player.z=7;yaw=0;pitch=0;}
  if(plan){ortho.position.set(0,planLayer==='ceiling'?1:30,0);ortho.up.set(0,0,-1);ortho.lookAt(0,planLayer==='ceiling'?3:0,0);target.set(0,0,0);}
  layers();$('help').textContent=plan?'Geometry-derived projection · north at top':name==='room'||name==='walk'?'WASD / arrows · drag to look · E rings nearby chime':'Drag to orbit · scroll to zoom';
 }
 for(const name of ['arrival','room','clearing','plan','ceiling','walk'])$(name).onclick=()=>view(name);
 $('palette').onchange=applyPalette;$('plants').onchange=layers;$('furniture').onchange=layers;
 function door(open){const result=model.setDoor(open,['room','walk'].includes(mode)?player:null);if(result.ok){fixture.setDoors();$('door').textContent=model.doorOpen?'Close cottage doors':'Open cottage doors';}else $('interaction').textContent=result.reason;return result;}
 $('door').onclick=()=>door(!model.doorOpen);
 let audio;
 function chime(){const result=model.room.interact(player);$('interaction').textContent=result.ok?`Chime rung · ${result.rings}`:result.reason;if(result.ok){audio??=new AudioContext();audio.resume();for(const[n,hz]of result.tones_hz.entries()){const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+n*.07;o.frequency.value=hz;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.7);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.75);}}return result;}
 $('chime').onclick=chime;
 for(const o of model.vegetation){const option=document.createElement('option');option.value=o.id;option.textContent=`${o.id} · ${o.reference_id||'identity pending'}`;$('specimen').append(option);}
 $('specimen').onchange=()=>{const o=model.vegetation.find(o=>o.id===$('specimen').value);if(!o){marker.visible=false;return;}view('clearing');target.set(o.x,o.y+o.height*.4,o.z);range=Math.max(12,o.height*2.8);marker.position.set(o.x,o.y+.06,o.z);ring.scale.setScalar(Math.max(.5,o.radius));marker.visible=true;$('specimen-info').textContent=`${o.id} · ${o.reference_id||'No exact reference assigned'} · height ${o.height.toFixed(2)} m · ${o.status}`;};
 for(const text of model.limits){const li=document.createElement('li');li.textContent=text;$('limits').append(li);}$('loop-length').textContent=model.loop_length_m.toFixed(2)+' m';
 function startRoute(name=$('route').value){view('walk');const ps=model.routes[name];player.x=ps[0][0];player.z=ps[0][1];run={name,points:resample(ps,.15),index:1,travelled_m:0,length_m:length(ps),status:'running'};state.run={name,status:'running'};}
 $('run').onclick=()=>startRoute();
 function finish(status){state.run={name:run.name,status,travelled_m:run.travelled_m,length_m:run.length_m,position:{...player}};run=null;}
 addEventListener('keydown',e=>{if(['INPUT','SELECT','BUTTON'].includes(document.activeElement.tagName))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.code==='KeyE')chime();});addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>keys.clear());
 $('scene').onpointerdown=e=>{$('scene').focus();drag={x:e.clientX,y:e.clientY};$('scene').setPointerCapture(e.pointerId);};$('scene').onpointerup=()=>drag=null;
 $('scene').onpointermove=e=>{if(!drag)return;const dx=(e.clientX-drag.x)*.005,dy=(e.clientY-drag.y)*.005;drag={x:e.clientX,y:e.clientY};if(mode==='walk'||mode==='room'){yaw-=dx;pitch=Math.max(-1.4,Math.min(1.4,pitch-dy));}else if(!plan){orbitYaw-=dx;orbitPitch=Math.max(.08,Math.min(1.5,orbitPitch+dy));}};
 $('scene').onwheel=e=>{if(plan)return;e.preventDefault();range=Math.max(8,Math.min(200,range*Math.exp(e.deltaY*.001)));};
 function tick(now){const dt=Math.min(.1,(now-last)/1000);last=now;
  if(run){let budget=24*dt;while(run&&budget>0){const q=run.points[run.index];if(!q){finish('pass');break;}const dx=q[0]-player.x,dz=q[1]-player.z,d=Math.hypot(dx,dz),step=Math.min(d,budget),got=model.move(player,dx/d*step,dz/d*step);if(Math.abs(got-step)>1e-5){finish('blocked');break;}run.travelled_m+=got;budget-=step;yaw=Math.atan2(-dx,-dz);if(d-step<1e-7)run.index++;}}
  else if(mode==='walk'||mode==='room'){let forward=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown')),right=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));const norm=Math.hypot(forward,right)||1,speed=(keys.has('ShiftLeft')?12:6)*dt;model.move(player,(-Math.sin(yaw)*forward+Math.cos(yaw)*right)/norm*speed,(-Math.cos(yaw)*forward-Math.sin(yaw)*right)/norm*speed);}
  const w=$('scene').clientWidth,h=$('scene').clientHeight;if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio()))renderer.setSize(w,h,false);perspective.aspect=w/h;perspective.updateProjectionMatrix();ortho.left=-9*w/h;ortho.right=9*w/h;ortho.top=9;ortho.bottom=-9;ortho.updateProjectionMatrix();
  if(mode==='walk'||mode==='room'){camera.position.set(player.x,model.surface(player.x,player.z)+1.6,player.z);camera.lookAt(player.x-Math.sin(yaw)*Math.cos(pitch),camera.position.y+Math.sin(pitch),player.z-Math.cos(yaw)*Math.cos(pitch));}
  else if(!plan){camera.position.set(target.x+Math.sin(orbitYaw)*Math.cos(orbitPitch)*range,target.y+Math.sin(orbitPitch)*range,target.z+Math.cos(orbitYaw)*Math.cos(orbitPitch)*range);camera.lookAt(target);}
  renderer.render(scene,camera);state.triangles=renderer.info.render.triangles;state.draw_calls=renderer.info.render.calls;
  $('status').textContent=state.run?`${state.run.name} · ${state.run.status}${run?' · '+run.travelled_m.toFixed(1):' · '+state.run.travelled_m.toFixed(2)} m`:`${mode} · local X ${player.x.toFixed(2)} / Z ${player.z.toFixed(2)} · floor world Y ${(model.surface(player.x,player.z)+model.origin.y).toFixed(2)} m · ${state.triangles.toLocaleString()} triangles / ${state.draw_calls} draws`;
  requestAnimationFrame(tick);
 }
 view('arrival');window.forestReview={ready:true,model,fixture,geo,state,view,door,startRoute,chime,player,setPlayer(x,z){if(!model.canStand(x,z))return false;player.x=x;player.z=z;return true;},ceilingDistance(){fixture.root.updateMatrixWorld(true);return new THREE.Raycaster(new THREE.Vector3(0,1.6,0),new THREE.Vector3(0,1,0)).intersectObject(fixture.groups.ceiling,true).find(h=>h.point.y>2)?.point.y;}};requestAnimationFrame(tick);
}catch(e){$('error').hidden=false;$('error').textContent=e.stack||e.message;throw e;}
