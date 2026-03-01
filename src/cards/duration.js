/**
 * 高级版 - 学习时长趋势卡片 (丝滑贝塞尔面积图)
 */
const { getTheme } = require('../themes');

// 平滑曲线生成算法
function getSmoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr.x + next.x) / 2;
    path += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
  }
  return path;
}

function renderDurationCard(data, themeName = 'light', showLabels = false) {
  const t = getTheme(themeName);
  const width = 540;
  const height = 280;
  const chartX = 55;
  const chartBottom = 220;
  const chartWidth = 440;
  const chartHeight = 110;

  const durations = data.durationList.map((d) => d.duration);
  const dates = data.durationList.map((d) => d.date);
  const maxVal = Math.max(...durations, 1);
  const groupWidth = chartWidth / (dates.length - 1 || 1);

  // 绘制横向参考基准线
  const linesCount = 3;
  const gridLines = Array.from({ length: linesCount + 1 }).map((_, i) => {
    const val = Math.round(maxVal - (maxVal / linesCount) * i);
    const y = chartBottom - chartHeight + (chartHeight / linesCount) * i;
    return `
    <line x1="${chartX - 5}" y1="${y}" x2="${chartX + chartWidth}" y2="${y}" stroke="${t.gridLine}" stroke-width="1.5" stroke-linecap="round"/>
    <text x="${chartX - 15}" y="${y + 4}" text-anchor="end" fill="${t.textSecondary}" font-size="11" font-family="'Inter', sans-serif">${val}</text>`;
  }).join('');

  // 坐标点计算
  const pointsData = dates.map((_, i) => ({
    x: chartX + i * groupWidth,
    y: chartBottom - (durations[i] / maxVal) * chartHeight
  }));

  // 获取深灰色/高亮平滑虚线
  const smoothLineDef = getSmoothPath(pointsData);

  // 生成闭合的面积曲线 
  const areaPath = `${smoothLineDef} L ${pointsData[pointsData.length - 1].x},${chartBottom} L ${pointsData[0].x},${chartBottom} Z`;

  const pointsDOM = pointsData.map((pt, i) => {
    const isToday = i === pointsData.length - 1;
    const color = t.durationMain;
    const rOuter = isToday ? 6 : 4;
    const rInner = isToday ? 3 : 2;

    let res = `<g>`;
    res += `<circle cx="${pt.x}" cy="${pt.y}" r="${rOuter}" fill="${t.dotBg}" stroke="${color}" stroke-width="2"/>`;
    if (isToday) {
      res += `<circle cx="${pt.x}" cy="${pt.y}" r="${rInner}" fill="${color}">
              <animate attributeName="r" values="${rInner};${rOuter};${rInner}" dur="2s" repeatCount="indefinite"/>
            </circle>`;
      res += `<rect x="${pt.x - 15}" y="${pt.y - 26}" width="30" height="16" rx="4" fill="${color}"/>`;
      res += `<text x="${pt.x}" y="${pt.y - 14}" text-anchor="middle" fill="#fff" font-size="10" font-weight="700" font-family="'Inter', sans-serif">${durations[i]}</text>`;
    } else if (showLabels) {
      // 历史节点的数值标签悬浮
      res += `<text x="${pt.x}" y="${pt.y - 12}" text-anchor="middle" fill="${t.textSecondary}" font-size="9" font-weight="600" font-family="'Inter', sans-serif">${durations[i]}</text>`;
    }
    const textWeight = isToday ? "700" : "500";
    const textColor = isToday ? t.title : t.textSecondary;
    res += `<text x="${pt.x}" y="${chartBottom + 20}" text-anchor="middle" fill="${textColor}" font-weight="${textWeight}" font-size="11" font-family="'Inter', sans-serif">${dates[i]}</text>`;
    res += `</g>`;
    return res;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <filter id="shadow-dur" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="${t.shadow}"/>
    </filter>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.durationMain}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${t.durationMain}" stop-opacity="0.0"/>
    </linearGradient>
  </defs>

  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="${t.bg}" rx="16" filter="url(#shadow-dur)" stroke="${t.border}" stroke-width="1"/>
  
  <!-- 头部信息 -->
  <g transform="translate(45, 45)">
    <text font-size="18" font-weight="800" fill="${t.title}" font-family="'Inter', sans-serif">专注时长</text>
    <text y="20" font-size="12" fill="${t.textSecondary}" font-family="'Inter', sans-serif">共 ${data.totalHours} 时 ${data.totalMinutes} 分</text>
  </g>
  <g transform="translate(${width - 45}, 45)">
    <text x="-35" font-size="28" font-weight="800" text-anchor="end" fill="${t.durationMain}" font-family="'Inter', sans-serif">${data.weekDurationTotal}</text>
    <text x="-27" y="-2" font-size="12" font-weight="600" text-anchor="start" fill="${t.text}" font-family="'Inter', sans-serif">分钟</text>
    <text x="-35" y="18" font-size="11" text-anchor="end" fill="${t.textSecondary}" font-family="'Inter', sans-serif">本周总计</text>
  </g>

  <!-- 图表区 -->
  <g>
    ${gridLines}
    <!-- 渐变面积 -->
    <path d="${areaPath}" fill="url(#areaGrad)"/>
    <!-- 平滑主线 -->
    <path d="${smoothLineDef}" fill="none" stroke="${t.durationMain}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- 节点 -->
    ${pointsDOM}
  </g>
</svg>`;
}

module.exports = { renderDurationCard };
