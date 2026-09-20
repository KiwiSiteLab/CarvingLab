# 克祥雕刻艺术 · Kexiang Sculpture Art

用于客户展示的雕塑艺术网站 Demo。象牙白石柱、金色线脚、拱顶吊灯、深青色墙面与拼花石材地面构成可滚动深入的三维展厅。

## 功能

- 滚动推进，左右展厅依次欣赏三件真实作品照片。
- 全部作品总览、作品详情、原图放大。
- 蓝红旋涡 Logo 与中英文品牌排版。
- 响应式布局、键盘操作、减少动态效果设置、WebGL 不可用时图片回退。
- 简单预定演示：不会向服务器发送资料、保存客户信息、锁定库存或实际收取定金。未来收款方向为 NZD 银行卡。

## 本机运行

需要 Node.js 22.13 或以上。

```sh
cd website
npm install
npm run dev
```

默认端口 3000，可从本机 `http://localhost:3000` 及同一局域网内的 `http://本机IPv4:3000` 访问。Windows 防火墙需允许本机 Node 服务接受局域网连接。不要将此演示服务端口转发到公网。

```sh
npm run typecheck
npm run build
npm run preview
```

`website/dist-demo` 是静态构建产物。默认开发/预览监听 `0.0.0.0`，停止进程后网址失效。

## 内容与边界

原始素材位于 `artwork`、`logo`；网页资产位于 `website/public`。作品名“初形、静观、栖风”为展览暂名，不代表艺术家的正式命名。材质、尺寸、售价、作品可预定状态均未虚构。

作品以真实照片置入三维建筑空间；没有作品的三维扫描模型，不能旋转观看雕塑背面。

修改作品资料：`website/lib/artworks.ts`。修改建筑装修：`website/components/royal-interior.ts`。修改页面及预定演示：`website/app/page.tsx`。
