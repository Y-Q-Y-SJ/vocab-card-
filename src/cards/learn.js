/**
 * 高级版 - 学习趋势卡片 (分组胶囊状柱形图)
 */
const { getTheme } = require('../themes');

function renderLearnCard(data, themeName = 'light', showLabels = false) {
  const t = getTheme(themeName);
  const width = 540;
  const height = 300;
  const chartX = 55;
  const chartY = 85;
  const chartWidth = 440;
  const chartHeight = 150;

  const learns = data.learnList.map((d) => d.learnNum);
  const reviews = data.learnList.map((d) => d.reviewNum);
  const maxVal = Math.max(...learns, ...reviews, 1);
  const dates = data.learnList.map((d) => d.date);

  const groupWidth = chartWidth / dates.length;
  const barWidth = 10;
  const barGap = 4; // 两个柱子之间的间隙

  // 生成Y轴刻度与横向网格基准线
  const linesCount = 4;
  const gridLines = Array.from({ length: linesCount + 1 }).map((_, i) => {
    const val = Math.round(maxVal - (maxVal / linesCount) * i);
    const y = chartY + (chartHeight / linesCount) * i;
    return `
    <line x1="${chartX - 5}" y1="${y}" x2="${chartX + chartWidth}" y2="${y}" stroke="${t.gridLine}" stroke-width="1.5" stroke-dasharray="4 4" stroke-linecap="round"/>
    <text x="${chartX - 15}" y="${y + 4}" text-anchor="end" fill="${t.textSecondary}" font-size="11" font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${val}</text>`;
  }).join('');

  const barGroups = dates.map((date, i) => {
    const cx = chartX + i * groupWidth + groupWidth / 2;

    const learnH = (learns[i] / maxVal) * chartHeight;
    const reviewH = (reviews[i] / maxVal) * chartHeight;

    const learnX = cx - barWidth - barGap / 2;
    const reviewX = cx + barGap / 2;
    const learnY = chartY + chartHeight - learnH;
    const reviewY = chartY + chartHeight - reviewH;

    let res = `<g class="capsule-group">`;

    // 新学底槽
    res += `<rect x="${learnX}" y="${chartY}" width="${barWidth}" height="${chartHeight}" rx="${barWidth / 2}" fill="${t.learnLight}" opacity="0.3"/>`;
    // 复习底槽
    res += `<rect x="${reviewX}" y="${chartY}" width="${barWidth}" height="${chartHeight}" rx="${barWidth / 2}" fill="${t.reviewLight}" opacity="0.3"/>`;

    if (learns[i] > 0) {
      res += `<rect x="${learnX}" y="${learnY}" width="${barWidth}" height="${learnH}" rx="${barWidth / 2}" fill="${t.learnMain}">
              <animate attributeName="height" from="0" to="${learnH}" dur="0.8s" begin="${i * 0.05}s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
              <animate attributeName="y" from="${chartY + chartHeight}" to="${learnY}" dur="0.8s" begin="${i * 0.05}s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
            </rect>`;
      if (showLabels) {
        res += `<text x="${learnX + barWidth / 2}" y="${learnY - 6}" text-anchor="middle" font-size="9" fill="${t.textSecondary}" font-family="'Inter', sans-serif">${learns[i]}</text>`;
      }
    }
    if (reviews[i] > 0) {
      res += `<rect x="${reviewX}" y="${reviewY}" width="${barWidth}" height="${reviewH}" rx="${barWidth / 2}" fill="${t.reviewMain}">
              <animate attributeName="height" from="0" to="${reviewH}" dur="0.8s" begin="${i * 0.05 + 0.1}s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
              <animate attributeName="y" from="${chartY + chartHeight}" to="${reviewY}" dur="0.8s" begin="${i * 0.05 + 0.1}s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
            </rect>`;
      if (showLabels) {
        res += `<text x="${reviewX + barWidth / 2}" y="${reviewY - 6}" text-anchor="middle" font-size="9" fill="${t.textSecondary}" font-family="'Inter', sans-serif">${reviews[i]}</text>`;
      }
    }

    // 底部日期
    const isToday = i === dates.length - 1;
    const dateColor = isToday ? t.title : t.textSecondary;
    const dateWeight = isToday ? "700" : "500";
    res += `<text x="${cx}" y="${chartY + chartHeight + 22}" text-anchor="middle" fill="${dateColor}" font-weight="${dateWeight}" font-size="11" font-family="'Inter', sans-serif">${date}</text>`;
    res += `</g>`;
    return res;
  }).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <filter id="shadow-main" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="${t.shadow}"/>
    </filter>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="transparent"/>
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="${t.bg}" rx="16" filter="url(#shadow-main)" stroke="${t.border}" stroke-width="1"/>
  
  <g transform="translate(45, 45)">
    <text font-size="18" font-weight="800" fill="${t.title}" font-family="'Inter', sans-serif">学习趋势</text>
    <text y="20" font-size="12" fill="${t.textSecondary}" font-family="'Inter', sans-serif">近 7 天生词输入分布</text>
  </g>

  <!-- 右上角图例 -->
  <g transform="translate(${width - 130}, 45)">
    <rect width="12" height="12" rx="4" fill="${t.learnMain}"/>
    <text x="20" y="10" font-size="12" font-weight="600" fill="${t.text}" font-family="'Inter', sans-serif">新学</text>
    <rect x="55" width="12" height="12" rx="4" fill="${t.reviewMain}"/>
    <text x="75" y="10" font-size="12" font-weight="600" fill="${t.text}" font-family="'Inter', sans-serif">复习</text>
  </g>

  <!-- 图表区 -->
  <g>
    ${gridLines}
    ${barGroups}
  </g>
</svg>`;
}

module.exports = { renderLearnCard };
