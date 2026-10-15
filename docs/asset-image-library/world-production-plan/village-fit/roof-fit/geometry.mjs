import{THREE,roofGeometry,wallGeometry}from '../geometry.mjs';
import{placeFitting}from '../details-geometry.mjs';
const shape=ps=>{const s=new THREE.Shape();ps.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s;};
// Ring with variable lower/upper datum. Its through-bore remains a real hole.
export function ringGeometry(cx,cz,outer,inner,bottom,top){
 const points=h=>[[-h,-h],[h,-h],[h,h],[-h,h]],s=shape(points(outer/2)),hole=new THREE.Path();
 points(inner/2).reverse().forEach(([x,z],i)=>i?hole.lineTo(x,z):hole.moveTo(x,z));hole.closePath();s.holes.push(hole);
 const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false}),p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i)+cx,z=p.getY(i)+cz,t=p.getZ(i),lo=bottom(x,z),hi=top(x,z);p.setXYZ(i,x,lo+(hi-lo)*t,z);}g.computeVertexNormals();return g;
}
// A gridded closed shell with exposed edges only. Rectangular cuts can straddle repeat ends.
export function cutRoofGeometry(r,cuts=[]){
 const loZ=r.z-.001,hiZ=r.z+r.length+.001;
 const relevant=cuts.filter(c=>c.xmax>r.x&&c.xmin<r.x+r.span&&c.zmax>loZ&&c.zmin<hiZ);
 if(!relevant.length)return roofGeometry(r);
 const xs=[r.x,r.x+r.span/2,r.x+r.span,...relevant.flatMap(c=>[c.xmin,c.xmax]).filter(x=>x>r.x&&x<r.x+r.span)].sort((a,b)=>a-b),zs=[loZ,hiZ,...relevant.flatMap(c=>[c.zmin,c.zmax]).filter(z=>z>loZ&&z<hiZ)].sort((a,b)=>a-b),xx=[...new Set(xs)],zz=[...new Set(zs)];
 const solid=(i,j)=>i>=0&&j>=0&&i<xx.length-1&&j<zz.length-1&&!relevant.some(c=>(xx[i]+xx[i+1])/2>c.xmin&&(xx[i]+xx[i+1])/2<c.xmax&&(zz[j]+zz[j+1])/2>c.zmin&&(zz[j]+zz[j+1])/2<c.zmax);
 const positions=[],indices=[],nx=xx.length,nz=zz.length;
 for(const down of [0,1])for(const z of zz)for(const x of xx){const t=(x-r.x)/(r.span/2),y=r.eave+r.rise*(t<=1?t:2-t)-down*r.thickness;positions.push(x,y,z);}
 const at=(i,j,down=0)=>down*nx*nz+j*nx+i,quad=(a,b,c,d)=>indices.push(a,b,c,a,c,d);
 for(let i=0;i<nx-1;i++)for(let j=0;j<nz-1;j++)if(solid(i,j)){
  const a=at(i,j),b=at(i+1,j),c=at(i+1,j+1),d=at(i,j+1),aa=at(i,j,1),bb=at(i+1,j,1),cc=at(i+1,j+1,1),dd=at(i,j+1,1);
  quad(a,d,c,b);quad(aa,bb,cc,dd);
  if(!solid(i,j-1))quad(a,b,bb,aa);if(!solid(i+1,j))quad(b,c,cc,bb);if(!solid(i,j+1))quad(c,d,dd,cc);if(!solid(i-1,j))quad(d,a,aa,dd);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);const out=g.toNonIndexed();g.dispose();out.computeVertexNormals();return out;
}
function clippedGable(g){let ps=[[g.x,g.base],[g.x+g.span,g.base],[g.x+g.span/2,g.base+g.rise]];
 for(const [edge,sign]of [[g.clip_min,1],[g.clip_max,-1]]){const out=[];for(let i=0;i<ps.length;i++){const a=ps[i],b=ps[(i+1)%ps.length],ia=(a[0]-edge)*sign>=0,ib=(b[0]-edge)*sign>=0;if(ia)out.push(a);if(ia!==ib){const t=(edge-a[0])/(b[0]-a[0]);out.push([edge,a[1]+t*(b[1]-a[1])]);}}ps=out;}
 const geo=new THREE.ExtrudeGeometry(shape(ps),{depth:g.depth,bevelEnabled:false});geo.translate(0,0,g.z-g.depth/2);return geo;
}
function channelGeometry(v){const points=[],indices=[],profile=z=>[[v.x-v.wing_half,5.2+v.wing_half*(2.8/3)-.01,z],[v.x,v.floorAt(z),z],[v.x+v.wing_half,5.2+v.wing_half*(2.8/3)-.01,z]];
 for(const down of [0,1])for(const z of [v.rear,v.front])for(const [x,y,zz]of profile(z))points.push(x,y-down*v.thickness,zz);
 const q=(a,b,c,d)=>indices.push(a,b,c,a,c,d);
 for(let i=0;i<2;i++){q(i,i+3,i+4,i+1);q(i+6,i+7,i+10,i+9);}q(0,6,9,3);q(2,5,11,8);q(0,1,7,6);q(1,2,8,7);q(3,9,10,4);q(4,10,11,5);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function buildRoofGeometry(m,material){
 const root=new THREE.Group(),groups={},objects=new Map();for(const name of ['roof','walls','construction','pot','drain','ground']){groups[name]=new THREE.Group();root.add(groups[name]);}
 const add=(id,geometry,slot,layer='construction')=>{const mesh=new THREE.Mesh(geometry,material(slot));mesh.name=id;groups[layer].add(mesh);objects.set(id,mesh);return mesh;};
 const box=(id,x,y,z,w,h,d,slot='wood',layer='construction')=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y+h/2,z);return add(id,g,slot,layer);};
 for(const r of m.roofs)add(r.id,cutRoofGeometry(r,r.cuts),'roof','roof');
 for(const w of m.walls)add(w.id,wallGeometry(w,m.village.openings),'plaster','walls');
 for(const g of m.gables)add(g.id,clippedGable(g),'plaster','walls');
 // Seam backers follow the actual V profile and share every scheduled cut.
 for(const x of [18,24])for(const z of [-12,-9])add(`BACKER-${x}-${z}`,cutRoofGeometry({x,z:z-.08,length:.16,span:6,eave:5.06,rise:2.8,thickness:.04},m.cuts),'metal');
 for(const x of [21,27]){const g=cutRoofGeometry({x:x-.2,z:-15,length:9,span:.4,eave:8-.2*(2.8/3)+.012,rise:.2*(2.8/3),thickness:.014},[]);add(`RIDGE-CAP-${x}`,g,'metal');}
 for(const r of m.rafters){const g=cutRoofGeometry({x:r.xmin,z:r.zmin+.001,length:r.zmax-r.zmin-.002,span:6,eave:4.85,rise:2.8,thickness:.2},[{xmin:21,xmax:30,zmin:-20,zmax:0}]);
  // The left half is a single straight upslope rafter; its top is the roof underside.
  g.translate(0,.2,0);add(r.id,g,'wood');
 }
 box('RIDGE-BEARING-BEAM',21,7.65,-10.5,.2,.2,9,'wood');
 add('VENT-BEARING-COLLAR',ringGeometry(m.shaft.x,m.shaft.z,.9,.4,(x)=>m.roofY(x)-.35,(x)=>m.roofY(x)-.15),'wood');
 add(m.shaft.id,ringGeometry(m.shaft.x,m.shaft.z,m.shaft.outer,m.shaft.bore,x=>m.shaft.baseAt(x),()=>m.shaft.top),'stone');
 add('VENT-CROWN-SEAT',ringGeometry(m.shaft.x,m.shaft.z,.6,m.shaft.bore,()=>8.06,()=>8.1),'stone');
 const apron={x:m.shaft.x-.525,z:m.shaft.z-.6,length:1.2,span:6,eave:m.roofY(m.shaft.x-.525)+.012,rise:2.8,thickness:.014};
 // A single slope panel, trimmed to its apron footprint; the outer half is discarded.
 const apronCuts=[{xmin:m.shaft.x+.525,xmax:40,zmin:-20,zmax:0},{xmin:m.shaft.x-.275,xmax:m.shaft.x+.275,zmin:m.shaft.z-.275,zmax:m.shaft.z+.275}];
 add('VENT-FLASHING-APRON',cutRoofGeometry(apron,apronCuts),'metal');
 add('VENT-FLASHING-UPSTAND',ringGeometry(m.shaft.x,m.shaft.z,.58,.55,x=>m.roofY(x)+.012,x=>m.roofY(x)+.212),'metal');
 const pot=placeFitting(m.pot,{},material);pot.name=m.pot.id;groups.pot.add(pot);objects.set(m.pot.id,pot);
 add(m.valley.id,channelGeometry(m.valley),'metal','drain');
 // Back stop only; front end stays open to its downpipe inlet.
 const rear=m.valley.rear,lip=5.2+m.valley.wing_half*(2.8/3)-.01;
 const cap=shape([[m.valley.x-.32,m.valley.floorAt(rear)],[m.valley.x+.32,m.valley.floorAt(rear)],[m.valley.x+.32,lip],[m.valley.x-.32,lip]]),cg=new THREE.ExtrudeGeometry(cap,{depth:.012,bevelEnabled:false});cg.translate(0,0,rear-.012);add('VALLEY-REAR-STOP',cg,'metal','drain');
 const pipe=ringGeometry(m.pipe.x,m.pipe.z,m.pipe.outer,m.pipe.bore,()=>m.pipe.bottom,()=>m.pipe.top);add(m.pipe.id,pipe,'metal','drain');
 for(const y of [1,3.2,4.5]){box('PIPE-PLATE-'+y,24,y,-5.84,.12,.12,.02,'metal','drain');box('PIPE-STANDOFF-'+y,24,y+.04,(-5.83+m.pipe.z)/2,.035,.035,m.pipe.z+5.83,'metal','drain');}
 // Open sump has a bottom and no hidden pipe to an invented world drain.
 add('SUMP-WALLS',ringGeometry(24,m.pipe.z,.5,.4,()=>-.14,()=>.05),'stone','drain');box('SUMP-BASE',24,-.16,m.pipe.z,.5,.02,.5,'stone','drain');
 // Cut the presentation ground around the sump instead of covering its cavity.
 const northEnd=m.pipe.z-.25,southStart=m.pipe.z+.25;
 for(const [id,x,z,w,d]of [['GROUND-W',20.875,-10.3,5.75,12.4],['GROUND-E',27.125,-10.3,5.75,12.4],['GROUND-N',24,(-16.5+northEnd)/2,.5,northEnd+16.5],['GROUND-S',24,(southStart-4.1)/2,.5,-4.1-southStart]])box(id,x,-.2,z,w,.2,d,'ground','ground');
 root.updateMatrixWorld(true);return {root,groups,objects};
}
export{THREE};
