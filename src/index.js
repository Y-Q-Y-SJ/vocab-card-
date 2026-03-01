/**
 * Vocab Card - Express 服务入口
 * 动态生成背诵单词统计 SVG 卡片
 */
const express = require('express');
const { fetchUserData } = require('./api');
const { renderOverviewCard } = require('./cards/overview');
const { renderLearnCard } = require('./cards/learn');
const { renderDurationCard } = require('./cards/duration');
const { generateSid } = require('./sidHelper');

const app = express();
const PORT = process.env.PORT || 3000;
const DEFAULT_UID = process.env.UID || 'YOUR_UID_HERE';
const DEFAULT_SID = process.env.SID || 'YOUR_SID_HERE';

// 通用中间件：设置 SVG 响应头
function svgHeaders(res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader('Access-Control-Allow-Origin', '*');
}

function svgErrorHeaders(res) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
}

// 错误卡片 SVG
function renderErrorCard(message, themeName = 'light') {
  const isDark = themeName === 'dark';
  const bg = isDark ? '#0d1117' : '#ffffff';
  const border = isDark ? '#30363d' : '#e1e4e8';
  const text = isDark ? '#e6edf3' : '#24292f';
  const errColor = '#f85149';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="120" viewBox="0 0 495 120" fill="none">
  <rect width="495" height="120" fill="${bg}" rx="12" stroke="${border}" stroke-width="1"/>
  <text x="247" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="${errColor}" font-family="'Segoe UI', Ubuntu, sans-serif">⚠️ 错误</text>
  <text x="247" y="70" text-anchor="middle" font-size="13" fill="${text}" font-family="'Segoe UI', Ubuntu, sans-serif">${escapeXml(message)}</text>
  <text x="247" y="95" text-anchor="middle" font-size="11" fill="${isDark ? '#8b949e' : '#57606a'}" font-family="'Segoe UI', Ubuntu, sans-serif">请检查 uid 或 sid 参数是否正确</text>
</svg>`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =====================
// 路由
// =====================

function resolveSid(req) {
  let { sid, uid } = req.query;
  if (uid && uid !== 'YOUR_UID_HERE') {
    sid = generateSid(uid);
  } else if (!sid) {
    sid = DEFAULT_SID;
  }
  return sid;
}

// 概览卡片
app.get('/card', async (req, res) => {
  const { theme = 'light' } = req.query;
  const sid = resolveSid(req);

  if (!sid || sid === 'YOUR_SID_HERE') {
    svgErrorHeaders(res);
    return res.send(renderErrorCard('未提供有效的 uid 参数，请在 URL 中添加 ?uid=你的UID', theme));
  }

  try {
    const data = await fetchUserData(sid);
    const svg = renderOverviewCard(data, theme);
    svgHeaders(res);
    res.send(svg);
  } catch (err) {
    console.error(`[Overview] Error:`, err.message);
    svgErrorHeaders(res);
    res.send(renderErrorCard(err.message, theme));
  }
});

// 学习趋势卡片
app.get('/learn', async (req, res) => {
  const { theme = 'light', show_labels } = req.query;
  const sid = resolveSid(req);

  if (!sid || sid === 'YOUR_SID_HERE') {
    svgErrorHeaders(res);
    return res.send(renderErrorCard('未提供有效的 uid 参数，请在 URL 中添加 ?uid=你的UID', theme));
  }

  try {
    const data = await fetchUserData(sid);
    const isShowLabels = show_labels === 'true';
    const svg = renderLearnCard(data, theme, isShowLabels);
    svgHeaders(res);
    res.send(svg);
  } catch (err) {
    console.error(`[Learn] Error:`, err.message);
    svgErrorHeaders(res);
    res.send(renderErrorCard(err.message, theme));
  }
});

// 时长趋势卡片
app.get('/duration', async (req, res) => {
  const { theme = 'light', show_labels } = req.query;
  const sid = resolveSid(req);

  if (!sid || sid === 'YOUR_SID_HERE') {
    svgErrorHeaders(res);
    return res.send(renderErrorCard('未提供有效的 uid 参数，请在 URL 中添加 ?uid=你的UID', theme));
  }

  try {
    const data = await fetchUserData(sid);
    const isShowLabels = show_labels === 'true';
    const svg = renderDurationCard(data, theme, isShowLabels);
    svgHeaders(res);
    res.send(svg);
  } catch (err) {
    console.error(`[Duration] Error:`, err.message);
    svgErrorHeaders(res);
    res.send(renderErrorCard(err.message, theme));
  }
});

// 首页
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vocab Card - 背诵单词统计卡片</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
    }
    h1 { font-size: 2em; margin-bottom: 8px; }
    .subtitle { color: #8b949e; margin-bottom: 40px; }
    .cards { display: flex; flex-direction: column; gap: 24px; max-width: 520px; width: 100%; }
    .card-wrapper { background: #161b22; border-radius: 16px; padding: 16px; border: 1px solid #30363d; }
    .card-label { font-size: 13px; color: #8b949e; margin-bottom: 8px; font-family: monospace; }
    img { width: 100%; height: auto; border-radius: 8px; }
    .usage { margin-top: 40px; background: #161b22; border-radius: 16px; padding: 24px; border: 1px solid #30363d; max-width: 520px; width: 100%; }
    .usage h2 { font-size: 1.2em; margin-bottom: 16px; }
    code { background: #0d1117; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #79c0ff; }
    pre { background: #0d1117; padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0; font-size: 13px; color: #e6edf3; }
    .footer { margin-top: 40px; color: #6e7681; font-size: 13px; }
  </style>
</head>
<body>
  <h1>📖 Vocab Card</h1>
  <p class="subtitle">背诵单词统计卡片 · 嵌入你的 GitHub 主页</p>

  <div class="cards">
    <div class="card-wrapper">
      <div class="card-label">GET /card?uid=YOUR_UID&amp;theme=dark</div>
      <img src="/card?uid=${encodeURIComponent(DEFAULT_UID)}&theme=dark" alt="概览卡片"/>
    </div>
    <div class="card-wrapper">
      <div class="card-label">GET /learn?uid=YOUR_UID&amp;theme=dark</div>
      <img src="/learn?uid=${encodeURIComponent(DEFAULT_UID)}&theme=dark" alt="学习趋势"/>
    </div>
    <div class="card-wrapper">
      <div class="card-label">GET /duration?uid=YOUR_UID&amp;theme=dark</div>
      <img src="/duration?uid=${encodeURIComponent(DEFAULT_UID)}&theme=dark" alt="时长趋势"/>
    </div>
  </div>

  <div class="usage">
    <h2>📝 使用方法</h2>
    <p>在 GitHub README.md 中添加：</p>
    <pre>![背诵统计](https://your-server.com/card?uid=你的UID)
![学习趋势](https://your-server.com/learn?uid=你的UID&show_labels=true)
![时长趋势](https://your-server.com/duration?uid=你的UID&show_labels=true)</pre>
    <p style="margin-top: 12px;">支持参数：<code>theme=dark</code> 或 <code>theme=light</code>。<br>学习/时长趋势图支持 <code>show_labels=true</code> 在图表中显示每日数值标签。</p>
  </div>

  <p class="footer">Powered by Vocab Card · SVG 动态生成</p>
</body>
</html>`);
});

// 启动
app.listen(PORT, () => {
  console.log(`🚀 Vocab Card 服务已启动: http://localhost:${PORT}`);
  console.log(`📖 概览卡片: http://localhost:${PORT}/card?uid=YOUR_UID&theme=dark`);
  console.log(`📚 学习趋势: http://localhost:${PORT}/learn?uid=YOUR_UID&theme=dark`);
  console.log(`⏰ 时长趋势: http://localhost:${PORT}/duration?uid=YOUR_UID&theme=dark`);
});
