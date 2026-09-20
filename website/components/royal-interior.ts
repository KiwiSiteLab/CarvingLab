import * as T from "three";

// Architectural geometry is shared by all bays to keep the gallery light on mobile GPUs.
export function buildRoyalInterior(scene: T.Scene, renderer: T.WebGLRenderer) {
  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  const textures: T.Texture[] = [];
  const ivory = material("#ded1af", .72);
  const plaster = material("#bdb29b", .88);
  const navy = material("#183238", .92);
  const panel = material("#203f43", .86);
  const gold = material("#b68a3b", .29, .68);
  const paleGold = material("#dfbc70", .28, .6);
  const wood = material("#362921", .55);
  const darkStone = material("#27332f", .24, .18);
  const burgundy = material("#542d32", .94);
  const light = new T.MeshBasicMaterial({color:"#fff0c4"}); materials.add(light);
  const clear = new T.MeshPhysicalMaterial({color:"#fff2d4",roughness:.13,metalness:.15,transparent:true,opacity:.72}); materials.add(clear);
  function material(color:string,roughness:number,metalness=0) {const m=new T.MeshStandardMaterial({color,roughness,metalness});materials.add(m);return m;}
  function mesh(geometry:T.BufferGeometry, mat:T.Material, x:number,y:number,z:number,parent:T.Object3D=scene) {geometries.add(geometry);const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const cube=new T.BoxGeometry(1,1,1);geometries.add(cube);
  function box(x:number,y:number,z:number,w:number,h:number,d:number,mat:T.Material,parent:T.Object3D=scene) {const m=mesh(cube,mat,x,y,z,parent);m.scale.set(w,h,d);return m;}
  const shaft=new T.CylinderGeometry(.32,.4,5.15,24);geometries.add(shaft);
  const flute=new T.CylinderGeometry(.024,.024,4.85,5);geometries.add(flute);
  const archGeometry=new T.TorusGeometry(5.78,.13,8,56,Math.PI);geometries.add(archGeometry);
  const thinArchGeometry=new T.TorusGeometry(5.54,.038,6,56,Math.PI);geometries.add(thinArchGeometry);
  const discGeometry=new T.CylinderGeometry(.72,.72,.1,32);geometries.add(discGeometry);
  const bulbGeometry=new T.SphereGeometry(.065,8,6);geometries.add(bulbGeometry);
  const crystalGeometry=new T.OctahedronGeometry(.10);geometries.add(crystalGeometry);

  // A canvas texture gives the floor real repeating stone inlays and subtle veins.
  const tileCanvas=document.createElement("canvas");tileCanvas.width=tileCanvas.height=1024;
  const ctx=tileCanvas.getContext("2d")!;
  ctx.fillStyle="#d7cdb7";ctx.fillRect(0,0,1024,1024);
  let seed=42;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let row=0;row<4;row++)for(let col=0;col<4;col++){
    const dark=(row+col)%2===0;ctx.fillStyle=dark?"#3b423b":"#d7cdb7";ctx.fillRect(col*256,row*256,256,256);
    ctx.strokeStyle=dark?"#68706755":"#a89d8a55";ctx.lineWidth=1.4;
    for(let k=0;k<13;k++){ctx.beginPath();const sx=col*256+random()*256;const sy=row*256;ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+random()*130,sy+70,sx-random()*100,sy+180,sx+random()*100-50,sy+256);ctx.stroke();}
    ctx.strokeStyle="#aba18766";ctx.lineWidth=2;ctx.strokeRect(col*256,row*256,256,256);
  }
  const floorTexture=new T.CanvasTexture(tileCanvas);floorTexture.colorSpace=T.SRGBColorSpace;floorTexture.wrapS=floorTexture.wrapT=T.RepeatWrapping;floorTexture.repeat.set(2,8);floorTexture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);textures.push(floorTexture);
  const floorMaterial=new T.MeshStandardMaterial({map:floorTexture,roughness:.29,metalness:.17});materials.add(floorMaterial);
  const floor=mesh(new T.PlaneGeometry(14,64),floorMaterial,0,0,-16);floor.rotation.x=-Math.PI/2;
  for(const side of [-1,1]) {
    box(side*7,5.6,-17,.3,11.2,62,navy);
    box(side*6.82,.3,-17,.27,.6,62,darkStone);
    box(side*6.79,1.15,-17,.22,1.1,62,wood);
    [1.68,1.8,5.9,6.12].forEach(y=>box(side*6.67,y,-17,.16,.09,62,gold));
    box(side*6.8,6.3,-17,.35,.3,62,ivory);
    box(side*6.62,6.49,-17,.45,.13,62,paleGold);
    box(side*6.4,.018,-17,.05,.018,62,gold);
    box(side*5.2,.018,-17,.1,.018,62,gold);
    box(side*1.5,.02,-17,.045,.018,62,gold);
    for(let z=6;z>=-42;z-=8) {
      const x=side*5.8;
      box(x,.17,z,1,.34,1,wood);box(x,.37,z,.9,.12,.9,gold);box(x,.53,z,.8,.2,.8,ivory);
      mesh(shaft,ivory,x,3.2,z);
      for(let f=0;f<12;f++){const angle=f*Math.PI/6;mesh(flute,plaster,x+Math.sin(angle)*.344,3.2,z+Math.cos(angle)*.344);}
      [.69,.77,5.7,5.8].forEach(y=>mesh(new T.CylinderGeometry(.44,.44,.07,24),gold,x,y,z));
      box(x,5.98,z,.86,.23,.86,ivory);box(x,6.14,z,1.02,.09,1.02,paleGold);
      for(let a=0;a<4;a++){const ornament=mesh(new T.TorusGeometry(.105,.045,6,12),gold,x+(a%2?-.28:.28),5.95,z+(a<2?.46:-.46));ornament.rotation.z=a%2?-.4:.4;}
      // Gold moulding around recessed wall panels between the columns.
      box(side*6.78,3.8,z-4,.1,3.2,5.8,panel);
      for(const yy of [2.15,5.45])box(side*6.62,yy,z-4,.09,.06,5.95,gold);
      for(const zz of [z-7,z-1])box(side*6.62,3.8,zz,.09,3.35,.06,gold);
      for(const yy of [2.3,5.3])box(side*6.6,yy,z-4,.06,.025,5.65,paleGold);
      // Warm sconces, with crystal drops, are attached to each alcove.
      box(side*6.4,3.9,z-4,.35,.6,.14,gold);
      const glow=mesh(new T.SphereGeometry(.16,10,8),light,side*6.18,4.35,z-4);glow.scale.y=1.7;
      mesh(crystalGeometry,clear,side*6.22,3.65,z-4).scale.y=2.2;
      if(z===-2 || z===-18){const lamp=new T.PointLight(0xffc77e,9,6,2);lamp.position.set(side*6,4.4,z-4);scene.add(lamp);}
    }
  }
  // Barrel vault, with alternating ivory ribs and gilt edges.
  const vault=mesh(new T.CylinderGeometry(6.9,6.9,62,40,1,true,-Math.PI/2,Math.PI),ivory,0,6,-17);vault.rotation.x=-Math.PI/2;vault.material=new T.MeshStandardMaterial({color:"#b9ac8b",side:T.DoubleSide,roughness:.82});materials.add(vault.material);
  for(let z=6;z>=-42;z-=8){
    mesh(archGeometry,ivory,0,6.12,z);mesh(thinArchGeometry,gold,0,6.12,z-.12);
    // Rosette at the top of every transverse arch.
    const rosette=mesh(new T.TorusGeometry(.27,.09,8,12),gold,0,11.8,z);rosette.rotation.x=Math.PI/2;
  }
  // Coffered ribbons follow the vault, drawing the eye toward the far end.
  for(let a=1;a<8;a++) {
    const angle=a*Math.PI/8;const x=Math.cos(angle)*6.3;const y=6+Math.sin(angle)*6.3;
    box(x,y,-17,.065,.065,62,gold);
  }
  for(let z=1;z>=-35;z-=12) {
    const chandelier=new T.Group();chandelier.position.set(0,0,z);scene.add(chandelier);
    mesh(new T.CylinderGeometry(.035,.035,2.2,8),gold,0,9.2,0,chandelier);
    mesh(discGeometry,gold,0,8.1,0,chandelier);
    for(const [radius,y] of [[1.05,7.7],[.67,7.3],[.32,6.98]]) {
      const ring=mesh(new T.TorusGeometry(radius,.04,6,32),paleGold,0,y,0,chandelier);ring.rotation.x=Math.PI/2;
      const count=radius>1?16:12;
      for(let i=0;i<count;i++) {
        const a=i/count*Math.PI*2;const x=Math.cos(a)*radius;const zz=Math.sin(a)*radius;
        mesh(crystalGeometry,clear,x,y-.19,zz,chandelier).scale.set(.65,2.1,.65);
        if(radius>1 && i%2===0){mesh(new T.CylinderGeometry(.023,.023,.38,6),gold,x,y+.2,zz,chandelier);const bulb=mesh(bulbGeometry,light,x,y+.44,zz,chandelier);bulb.scale.y=1.7;}
      }
    }
    const glow=new T.PointLight(0xffd9a0,55,19,1.7);glow.position.set(0,7.7,z);scene.add(glow);
  }
  // The end wall reads as a royal salon with layered gold moulding and drapery.
  box(0,5.8,-44,14,11.6,.3,navy);
  box(0,4.2,-43.78,5.6,7.6,.2,wood);
  box(0,4.2,-43.6,5.35,7.35,.12,gold);
  box(0,4.2,-43.5,5.14,7.14,.1,panel);
  const medallion=mesh(new T.TorusGeometry(1.2,.06,8,64),paleGold,0,5.2,-43.35);
  const center=mesh(new T.TorusGeometry(.85,.024,6,48),gold,0,5.2,-43.3);center.rotation.z=Math.PI/4;
  for(const side of [-1,1]) for(let i=0;i<10;i++) {
    const curtain=mesh(new T.CylinderGeometry(.11,.17,7.5,8),burgundy,side*(4.6+i*.18),4.6,-43.4);curtain.scale.z=.7;
  }
  box(0,8.65,-43.2,12,.17,.27,gold);
  // Floor medallions create a measured procession through the gallery.
  for(const z of [-2,-14,-26]){
    const ring=mesh(new T.RingGeometry(1.12,1.18,64),gold,0,.022,z);ring.rotation.x=-Math.PI/2;
    const center=mesh(new T.PlaneGeometry(.8,.8),darkStone,0,.023,z);center.rotation.x=-Math.PI/2;center.rotation.z=Math.PI/4;
  }
  scene.add(new T.HemisphereLight(0xffedca,0x555b51,1.65));
  const sun=new T.DirectionalLight(0xffe9c8,2.6);sun.position.set(-3,9,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-35;sun.shadow.bias=-.001;scene.add(sun);
  return {gold,ivory,darkStone,box,mesh,dispose:()=>{geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
