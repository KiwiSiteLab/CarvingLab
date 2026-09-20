export const artworks = [
  { id: "KX-001", name: "初形", english: "Emergence", category: "抽象形体", image: `${import.meta.env.BASE_URL}artworks/figure.png`, ratio: 429 / 715, description: "几何体块中浮现柔和的人物轮廓。粗粝的肌理与流动的曲面，在同一形体上相遇。" },
  { id: "KX-002", name: "静观", english: "Quiet Contemplation", category: "人物雕塑", image: `${import.meta.env.BASE_URL}artworks/crowned.png`, ratio: 428 / 766, description: "低垂的眼眸、安静的面容，与层叠的冠饰形成细腻的对照。近看之下，每一道刻痕都留下塑造的过程。" },
  { id: "KX-003", name: "栖风", english: "Wings in the Wind", category: "凤鸟雕塑", image: `${import.meta.env.BASE_URL}artworks/phoenix.png`, ratio: 432 / 609, description: "羽翼展开，尾羽向下回旋。凤鸟的姿态在动与静之间，呈现向上生长的力量。" },
] as const;
