"use client";
import { useEffect, useRef, useState } from "react";
import { artworks } from "@/lib/artworks";

export default function Gallery({progress, overview, onSelect}: {progress: number; overview: boolean; onSelect: (index: number) => void}) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({progress, overview, onSelect});
  state.current = {progress, overview, onSelect};
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let stopped = false; let dispose = () => {};
    Promise.all([import("three"), import("./royal-interior"), import("three/examples/jsm/environments/RoomEnvironment.js")]).then(([T, {buildRoyalInterior}, {RoomEnvironment}]) => {
      if(stopped || !host.current) return;
      const el = host.current;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({antialias: true, alpha: false}); } catch {setFailed(true); return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
      renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
      renderer.domElement.setAttribute("aria-label", "三维雕塑长廊，点击作品查看详情");
      el.appendChild(renderer.domElement);
      const scene = new T.Scene(); scene.background = new T.Color("#32372f"); scene.fog = new T.Fog("#32372f", 36, 78);
      const camera = new T.PerspectiveCamera(58, 1, .1, 100);
      const environment = new RoomEnvironment();
      const pmrem = new T.PMREMGenerator(renderer);
      const environmentMap = pmrem.fromScene(environment,.04);
      scene.environment = environmentMap.texture;
      scene.environmentIntensity = .65;
      environment.dispose(); pmrem.dispose();
      const interior = buildRoyalInterior(scene,renderer);
      const dark = interior.darkStone;
      const meshes: InstanceType<typeof T.Mesh>[] = [];
      const targets: InstanceType<typeof T.Mesh>[]=[];
      const textures: InstanceType<typeof T.Texture>[]=[];
      const loader = new T.TextureLoader();
      artworks.forEach((art,i)=>{
        const x=i===1 ? 3.65 : -3.65; const z=-2-i*10; const height=3.9; const width=height*art.ratio;
        const group=new T.Group(); group.position.set(x,0,z);group.rotation.y=i===1 ? -.16 : .16;scene.add(group);
        const base = new T.Mesh(new T.BoxGeometry(width+.7,.65,1.35),dark);base.position.set(0,.325,0);base.castShadow=true;base.receiveShadow=true;group.add(base);meshes.push(base);
        interior.box(0,.66,0,width+.77,.08,1.4,interior.gold,group);
        interior.box(0,.09,0,width+.8,.1,1.45,interior.gold,group);
        const backing = new T.Mesh(new T.BoxGeometry(width+.27,height+.27,.13),interior.gold);backing.position.set(0,height/2+.69,0);backing.castShadow=true;group.add(backing);meshes.push(backing);
        for(const side of [-1,1]) interior.box(side*(width/2+.09),height/2+.69,.10,.03,height+.19,.06,interior.ivory,group);
        for(const y of [.6,height+.78]) interior.box(0,y,.10,width+.19,.03,.06,interior.ivory,group);
        const tex=loader.load(art.image,()=> { if (!stopped) render(); },undefined,()=>setFailed(true));tex.colorSpace=T.SRGBColorSpace;textures.push(tex);
        const photo=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:tex,toneMapped:false}));photo.position.set(0,height/2+.69,.076);photo.userData.index=i;group.add(photo);targets.push(photo);meshes.push(photo);
        const labelCanvas=document.createElement("canvas");labelCanvas.width=512;labelCanvas.height=128;
        const ctx=labelCanvas.getContext("2d")!;ctx.fillStyle="#b68a3b";ctx.fillRect(0,0,512,128);ctx.fillStyle="#30281c";ctx.font="24px sans-serif";ctx.fillText(`0${i+1}   ${art.english.toUpperCase()}`,28,62);
        const labelTex=new T.CanvasTexture(labelCanvas);textures.push(labelTex);
        const label=new T.Mesh(new T.PlaneGeometry(width,.28),new T.MeshBasicMaterial({map:labelTex}));label.position.set(0,.36,.681);group.add(label);meshes.push(label);
        const spot=new T.SpotLight(0xfff1d8,55,15,.65,.8,1.5);spot.position.set(x,6,z+2);spot.target.position.set(x,1.8,z);scene.add(spot,spot.target);
      });
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let frame=0, current=state.current.progress, oldTime=0, lastDraw=-1, lastAspect=0;
      renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
      function render() {renderer.render(scene,camera);}
      function animate(time:number) {
        if(stopped)return;
        const target=state.current.progress; current=reduced ? target : current+(target-current)*Math.min(1,(time-oldTime)/120);oldTime=time;
        const narrow=el.clientWidth<700;
        camera.position.set(Math.sin(current*Math.PI)*.25,narrow?3.1:2.9,(narrow?13:8.7)-current*20);
        camera.lookAt(narrow ? (Math.round(current*2)===1?1.9:-1.9) : 0, narrow?3.1:3.5,-13-current*20);
        if(Math.abs(current-lastDraw)>.00003 || camera.aspect!==lastAspect){render();lastDraw=current;lastAspect=camera.aspect;}
        frame=requestAnimationFrame(animate);
      }
      function resize() {lastDraw=-1;renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();render();}
      const observer=new ResizeObserver(resize);observer.observe(el);resize();frame=requestAnimationFrame(animate);
      const raycaster=new T.Raycaster(); const pointer=new T.Vector2();
      function hit(event:PointerEvent) {const rect=el.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(targets)[0];}
      function click(event:PointerEvent) {const item=hit(event);if(item)state.current.onSelect(item.object.userData.index);}
      function hover(event:PointerEvent) {renderer.domElement.style.cursor=hit(event)?"pointer":"default";}
      renderer.domElement.addEventListener("pointerup",click);renderer.domElement.addEventListener("pointermove",hover);
      const lost=(event:Event)=>{event.preventDefault();setFailed(true);};renderer.domElement.addEventListener("webglcontextlost",lost);
      dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener("pointerup",click);renderer.domElement.removeEventListener("pointermove",hover);renderer.domElement.removeEventListener("webglcontextlost",lost);meshes.forEach(m=>{m.geometry.dispose();const mats=Array.isArray(m.material)?m.material:[m.material];mats.forEach(mat=>mat.dispose());});textures.forEach(t=>t.dispose());interior.dispose();environmentMap.dispose();renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>setFailed(true));
    return()=>{stopped=true;dispose();};
  },[]);
  return <><div ref={host} className="webgl-gallery" aria-hidden="true"/>{failed && <div className="fallback-gallery">{artworks.map((art,index)=><button key={art.id} onClick={()=>onSelect(index)}><img src={art.image} alt={art.name}/><span>{art.name}</span></button>)}</div>}</>;
}
