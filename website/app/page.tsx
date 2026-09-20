"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Grid2X2, MoveUpRight, RotateCcw, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Gallery from "@/components/gallery";
import { artworks } from "@/lib/artworks";

export default function Home() {
  const logoUrl = `${import.meta.env.BASE_URL}kexiang-symbol.png`;
  const [progress, setProgress] = useState(0);
  const [overview, setOverview] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");
  const [about, setAbout] = useState(false);
  const requestId = useRef("");
  const active = Math.min(2, Math.round(progress * 2));
  useEffect(() => {
    const update = () => setProgress(Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
    window.addEventListener("scroll", update, { passive: true }); update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  function go(index: number) {
    setOverview(false);
    window.scrollTo({ top: index / 2 * (document.documentElement.scrollHeight - innerHeight), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function open(index: number, reserve = false) {
    setSelected(index); setBooking(reserve); setZoom(false); setReceipt(""); setError(""); requestId.current = "demo";
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending || selected === null) return;
    setError("");
    setReceipt(`DEMO-${artworks[selected].id}`);
  }

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options: { signal: AbortSignal }) => unknown } }).modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    Promise.resolve(context.registerTool({ name: "open_sculpture", description: "Open a sculpture's details. Does not reserve or charge.", inputSchema: { type: "object", properties: { artworkId: { type: "string", enum: artworks.map(a => a.id) } }, required: ["artworkId"], additionalProperties: false }, execute: (input: { artworkId: string }) => { const index = artworks.findIndex(a => a.id === input.artworkId); if (index < 0) throw new Error("Unknown artwork"); open(index); return { opened: input.artworkId }; } }, { signal: lifecycle.signal })).catch(() => {});
    return () => lifecycle.abort();
  }, []);
  return <main className="scroll-journey">
    <div className="exhibition-shell">
      <header className="site-header">
        <button className="brand" onClick={() => go(0)} aria-label="克祥雕刻艺术，返回长廊起点"><img src={logoUrl} alt="蓝红漩涡标识" /><span><b>克祥雕刻艺术</b><small>KEXIANG SCULPTURE ART</small></span></button>
        <nav aria-label="主导航"><button className={!overview ? "nav-active" : ""} onClick={() => setOverview(false)}>雕塑长廊</button><button className={overview ? "nav-active" : ""} onClick={() => setOverview(true)}>全部作品 <sup>03</sup></button><button onClick={() => setAbout(true)}>关于工作室</button></nav>
        <button className="header-book" onClick={() => open(active, true)}>作品预定 <MoveUpRight size={15}/></button>
      </header>
      <section className={`gallery-stage ${overview ? "is-overview" : ""}`} aria-label="沉浸式雕塑展厅">
        <Gallery progress={progress} overview={overview} onSelect={open}/><div className="stage-vignette"/>
        <div className="exhibition-heading"><div className="eyebrow"><span/> 克祥 · 线上雕塑展</div><h1>{overview ? "一览，万象。" : "循形入境。"}</h1><p>{overview ? "The collection, at a glance." : "A passage into sculptural art."}</p></div>
        <div className="stage-topright"><span>线上展厅 · 演示版</span><span>SCULPTURE GALLERY</span></div>
        <button className="view-toggle" onClick={() => setOverview(!overview)}>{overview ? <ArrowLeft size={17}/> : <Grid2X2 size={17}/>} {overview ? "返回长廊" : "拉远 · 作品总览"}</button>
        {!overview && <div className="exhibit-label"><span className="work-number">0{active + 1}<i> / 03</i></span><div><h2>{artworks[active].name}<small>{artworks[active].english}</small></h2><p>{artworks[active].category}</p></div><button onClick={() => open(active)} aria-label={`查看${artworks[active].name}详情`}><MoveUpRight size={23}/></button></div>}
        {!overview && <div className="scroll-hint"><span className="mouse-icon"/><span>{progress > .97 ? "已抵达长廊尽头" : "向下滚动，步入长廊"}</span><ArrowDown size={14}/></div>}
        <div className="gallery-caption">形有所止，意无穷尽。<span>FORM ENDS. EXPRESSION CONTINUES.</span></div>
        {overview && <div className="overview-cards">{artworks.map((art, index) => <button key={art.id} className="overview-card" onClick={() => open(index)}><span className="overview-image"><img src={art.image} alt={art.name}/><Maximize2 size={18}/></span><span className="overview-info"><small>0{index + 1} / {art.category}</small><b>{art.name}<MoveUpRight size={20}/></b><em>{art.english}</em></span></button>)}</div>}
      </section>
      <footer className="gallery-footer"><div className="footer-intro"><span>一方空间 · 三种表达</span><small>THE ART OF FORM</small></div><div className="journey-controls"><button onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label="上一件作品"><ArrowLeft size={18}/></button><div className="journey-stops">{artworks.map((art, i) => <button key={art.id} onClick={() => go(i)} className={active === i ? "current" : ""} aria-label={`前往${art.name}`} aria-current={active === i ? "step" : undefined}><span>0{i+1}</span><i/></button>)}<div className="journey-track"><span style={{width: `${progress * 100}%`}}/></div></div><button onClick={() => go(Math.min(2, active + 1))} disabled={active === 2} aria-label="下一件作品"><ArrowRight size={18}/></button></div><button className="restart" onClick={() => go(0)}><RotateCcw size={14}/><span>重新漫游</span></button></footer>
    </div>
    <Dialog open={selected !== null} onOpenChange={value => { if(!value && !pending) {setSelected(null); setZoom(false);} }}>
      {selected !== null && <DialogContent className={`art-dialog ${zoom ? "zoom-dialog" : ""}`}><DialogTitle className="sr-only">{artworks[selected].name} · 作品详情</DialogTitle><DialogDescription className="sr-only">查看原作照片、作品信息和预定意向表单。</DialogDescription>
        <div className="detail-photo"><img src={artworks[selected].image} alt={artworks[selected].name}/><button onClick={() => setZoom(!zoom)}><Maximize2 size={16}/>{zoom ? "返回详情" : "放大原图"}</button><span>作品原始照片</span></div>
        {!zoom && <div className="detail-copy"><span className="eyebrow">作品 0{selected + 1} · {artworks[selected].category}</span><h2>{artworks[selected].name}</h2><p className="english-title">{artworks[selected].english}</p>
          {receipt ? <div className="receipt" role="status"><span className="receipt-icon">✓</span><h3>演示预定已生成</h3><p>演示编号：<strong>{receipt}</strong></p><p>这是演示流程，信息未发送给工作室，不会保存联系资料、锁定作品或收取任何费用。</p><button className="primary-button" onClick={() => setSelected(null)}>继续看展 <ArrowRight size={16}/></button></div> : booking ? <form onSubmit={submit} className="reservation-form"><p className="booking-note">预定流程演示。可填写示例信息，体验作品预定步骤。</p><div className="field-pair"><label>称呼<input name="name" required maxLength={80} autoComplete="name" placeholder="您的称呼"/></label><label>联系电话（选填）<input name="phone" maxLength={40} autoComplete="tel" type="tel" placeholder="+64"/></label></div><label>电子邮箱<input name="email" required type="email" maxLength={180} autoComplete="email" placeholder="you@example.com"/></label><label>您的想法（选填）<textarea name="message" rows={2} maxLength={1500} placeholder="例如摆放空间、收藏意向或定制需求"/></label><input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><div className="payment-note"><span>NZD · 银行卡定金</span><small>未来支持 NZD 银行卡定金；此演示不会付款。</small></div><label className="consent"><input type="checkbox" name="consent" required/><span>我了解这是演示，不会实际提交预定或扣款。</span></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="primary-button" type="submit" disabled={pending}>{pending ? "正在提交…" : "体验预定"}<ArrowRight size={16}/></button><button type="button" className="text-button" onClick={() => setBooking(false)} disabled={pending}>返回作品详情</button></form> : <><p className="art-description">{artworks[selected].description}</p><dl className="art-facts"><div><dt>作品编号</dt><dd>{artworks[selected].id}</dd></div><div><dt>材质 / 尺寸</dt><dd>向工作室咨询</dd></div><div><dt>收藏价格</dt><dd>询价 · NZD</dd></div></dl><p className="catalog-note">展览名称为暂名，具体作品信息及可预定状态以工作室确认为准。</p><button className="primary-button" onClick={() => setBooking(true)}>预定这件作品 <MoveUpRight size={16}/></button><small className="no-charge">演示样板 · 不实际下单或扣款</small></>}
        </div>}
      </DialogContent>}
    </Dialog>
    <Dialog open={about} onOpenChange={setAbout}><DialogContent className="about-dialog"><img src={logoUrl} alt=""/><DialogTitle>克祥雕刻艺术</DialogTitle><DialogDescription>Kexiang Sculpture Art</DialogDescription><p>在形体、纹理与光影之间，感受雕刻的表达。这里陈列工作室提供的三件雕塑作品照片，欢迎慢慢观看，也欢迎与我们交流收藏与定制意向。</p><p>点击作品即可查看原图和体验预定。作品价格、材质、尺寸、交付安排及定金，均由工作室进一步确认。</p><button className="primary-button" onClick={() => setAbout(false)}>继续漫游 <ArrowRight size={16}/></button></DialogContent></Dialog>
  </main>;
}
