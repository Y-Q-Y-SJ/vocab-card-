/**
 * 高级版 - 概览大卡片 (玻璃拟态与流彩渐变)
 */
const { getTheme } = require('../themes');

function renderOverviewCard(data, themeName = 'light') {
  const t = getTheme(themeName);
  const width = 540;
  const height = 240;

  // 微型趋势图逻辑
  const durations = data.durationList.map(d => d.duration);
  const maxD = Math.max(...durations, 1);
  const miniW = 140;
  const miniH = 50;

  // 微型折线生成
  let miniPoints = durations.map((v, i) => {
    return {
      x: i * (miniW / (durations.length - 1)),
      y: miniH - (v / maxD) * miniH
    };
  });
  let miniPath = `M ${miniPoints[0].x},${miniPoints[0].y}`;
  for (let i = 0; i < miniPoints.length - 1; i++) {
    const curr = miniPoints[i];
    const next = miniPoints[i + 1];
    const midX = (curr.x + next.x) / 2;
    miniPath += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
  }

  const isDark = themeName === 'dark';
  const shadowAttr = isDark ? '' : 'filter="url(#shadow-overview)"';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <filter id="shadow-overview" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="15" flood-color="${t.shadow}"/>
    </filter>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.gradStart}"/>
      <stop offset="100%" stop-color="${t.gradEnd}"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.bgFrame}"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="transparent"/>
  
  <!-- 主卡片 -->
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="url(#cardGrad)" rx="20" ${shadowAttr} stroke="${t.border}" stroke-width="1.5"/>
  
  <!-- 左上标题 -->
  <g transform="translate(45, 55)">
    <text font-size="22" font-weight="900" fill="${t.title}" font-family="'Inter', sans-serif">Vocab Daily 👋</text>
    <text y="24" font-size="13" font-weight="500" fill="${t.textSecondary}" font-family="'Inter', sans-serif">不积跬步，无以至千里</text>
  </g>

  <!-- 右上角迷你折线 -->
  <g transform="translate(${width - 200}, 40)">
    <text font-size="11" fill="${t.textSecondary}" font-family="'Inter', sans-serif" font-weight="600">近 7 天活跃走势</text>
    <g transform="translate(0, 15)">
      <path d="${miniPath}" fill="none" stroke="url(#bgGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${miniPoints.map((pt, i) => i === miniPoints.length - 1 ? `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="${t.dotBg}" stroke="${t.gradEnd}" stroke-width="2"/>` : `<circle cx="${pt.x}" cy="${pt.y}" r="2" fill="${t.gradStart}"/>`).join('')}
    </g>
  </g>

  <!-- 下方数据三联体 -->
  <g transform="translate(45, 125)">
    <!-- 模块 1: 新词 -->
    <g transform="translate(0, 0)">
      <rect width="135" height="70" rx="12" fill="${t.bg}" stroke="${t.border}" stroke-width="1" ${shadowAttr}/>
      <rect width="4" height="24" x="0" y="23" rx="2" fill="${t.learnMain}"/>
      <text x="18" y="26" font-size="12" font-weight="600" fill="${t.textSecondary}" font-family="'Inter', sans-serif">今日新学</text>
      <text x="18" y="52" font-size="22" font-weight="800" fill="${t.title}" font-family="'Inter', sans-serif">${data.todayLearn}<tspan font-size="12" font-weight="500" fill="${t.textSecondary}"> 词</tspan></text>
    </g>

    <!-- 模块 2: 复习 -->
    <g transform="translate(150, 0)">
      <rect width="135" height="70" rx="12" fill="${t.bg}" stroke="${t.border}" stroke-width="1" ${shadowAttr}/>
      <rect width="4" height="24" x="0" y="23" rx="2" fill="${t.reviewMain}"/>
      <text x="18" y="26" font-size="12" font-weight="600" fill="${t.textSecondary}" font-family="'Inter', sans-serif">今日复习</text>
      <text x="18" y="52" font-size="22" font-weight="800" fill="${t.title}" font-family="'Inter', sans-serif">${data.todayReview}<tspan font-size="12" font-weight="500" fill="${t.textSecondary}"> 词</tspan></text>
    </g>

    <!-- 模块 3: 累计 -->
    <g transform="translate(300, 0)">
      <rect width="165" height="70" rx="12" fill="${t.bg}" stroke="${t.border}" stroke-width="1" ${shadowAttr}/>
      <rect width="4" height="24" x="0" y="23" rx="2" fill="${t.durationMain}"/>
      <text x="18" y="26" font-size="12" font-weight="600" fill="${t.textSecondary}" font-family="'Inter', sans-serif">总长</text>
      <text x="18" y="52" font-size="20" font-weight="800" fill="${t.title}" font-family="'Inter', sans-serif">${data.totalHours}<tspan font-size="14" font-weight="600" fill="${t.textSecondary}">h </tspan>${data.totalMinutes}<tspan font-size="14" font-weight="600" fill="${t.textSecondary}">m</tspan></text>
    </g>
  </g>
</svg>`;
}

module.exports = { renderOverviewCard };
