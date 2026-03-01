# 📖 Vocab Card

> 动态生成不背单词统计 SVG 卡片，轻松嵌入 GitHub README 主页。
> 本项目灵感来源于优秀的开源项目：[github-bbdc-stat](https://github.com/left0ver/github-bbdc-stat)

## ✨ 特性

- 🎴 **精美 UI** — 完美还原不背单词官网风格（堆叠柱状图 / 趋势折线图）
- 🌗 **主题切换** — 亮色 / 暗色响应
- ⚡ **内存缓存** — 5 分钟缓存，减轻 API 压力
- 🌟 **无痛接入** — 只需提供你的数字 **UID**，后端全自动完成设备签名与加密，一行 Markdown 直接搞定！
- 📊 **动态数据标签** — 支持高度定制化，灵活开启各节点的详细数值悬浮显示。

## 🚀 快速开始

### 1. 获取你的 UID
无需进行任何复杂的抓包操作，直接在「不背单词」App 头像，更多设置最下方，找到你的**纯数字用户 ID (`UID`)** 即可使用！

### 2. 配置并运行服务

克隆代码后，在项目根目录：

```bash
# 安装所需依赖
npm install

# 启动项目（设置默认访问的 UID）
UID="你的uid" npm start

# 开发模式（自动重启）
npm run dev
```

服务默认运行在 `http://localhost:3000`。

### 3. 可选：内网穿透 / 上云

为了能在公开的 GitHub README 里访问图片，需要将服务部署到公网。可以使用 `Vercel` / `Railway` 等免费云服务，或者使用你自己的云服务器使用 Nginx 代理映射出来。

---

## 📝 使用方法

### 在 GitHub README 中嵌入

将 `your-server.com` 替换为你的服务器公网域名。**在 GitHub Markdown 中，你必须通过 URL 参数传入你的 `uid`**：

```markdown
<!-- 概览卡片 -->
![背诵统计](https://your-server.com/card?uid=你的UID&theme=dark)

<!-- 学习趋势 (单词生词与复习输入量) -->
![学习趋势](https://your-server.com/learn?uid=你的UID&theme=dark&show_labels=true)

<!-- 时长趋势 (本周学习时长走势) -->
![时长趋势](https://your-server.com/duration?uid=你的UID&theme=dark&show_labels=true)
```

### 可用 API 端点

| 端点 | 说明 |
|------|------|
| `GET /card` | 综合概览数据卡片 |
| `GET /learn` | 近 7 日新学 / 复习词数胶囊柱状图 |
| `GET /duration` | 近 7 日学习时长趋势微折线大图 |

### 查询参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `uid` | ✅ | 你的数字用户身份标识 |
| `theme` | ❌ | 主题切换：`light`（默认）或 `dark` |
| `show_labels` | ❌ | 选填 `true` 以在柱形图和折线图上显示具体的生词数、复习数和专注分钟数的详细标签 |

---

## 🖥️ 部署建议

### PM2 后台部署

```bash
npm install -g pm2
pm2 start src/index.js --name vocab-card
pm2 save
pm2 startup
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
# 传入你的 UID
ENV UID="你的uid"
CMD ["node", "src/index.js"]
```

## 💖 鸣谢 & 声明

- **“不背单词”是一款极其优秀的英语学习应用，拥有极致的 UI 设计美学和极佳的背词体验，强烈推荐所有英语学习爱好者使用原版 App 坚持打卡！**
- 本项目为开源技术分享与交流之作，**仅限用于个人学习、研究以及个人 GitHub 主页的卡片展示**。
- **严禁**将本项目及其附带的加密算法机制用于任何商业用途、批量注册、恶意攻击官方服务器或进行其它任何非法用途。由于使用者将本代码用于非法用途所带来的任何法律责任及后果，均与项目原作者无关。
- 项目在架构设计中已内置长效缓存机制以极大程度降低请求损耗。请各位使用者理智调用，共同保护“不背单词”美好的生态。
- UI 样式设计灵感来自不背单词官方打卡分享页，特此致敬。如官方团队认为该开源项目侵犯了任何权益，请联系我，我将配合立刻下架。

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。在遵守上方安全与免责声明所列举之前提下，你可以自由地分发、修改和使用本项目的代码。
