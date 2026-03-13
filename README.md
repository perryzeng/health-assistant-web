# 健康助手 Web 应用

一个私人健康数据追踪工具，数据完全存储在本地浏览器，保护隐私安全。

## 功能特性

- 📊 健康数据记录（体重、体脂率、BMI）
- 📈 数据可视化（折线图、趋势分析）
- 🤖 AI 健康建议（基于 Claude API）
- 💾 数据导出/导入（JSON 格式）
- 📱 响应式设计（支持桌面和移动端）
- 🔒 本地存储（数据不上传云端）

## 技术栈

- **前端**: React 19 + Vite 7
- **样式**: TailwindCSS 4
- **图表**: Chart.js + react-chartjs-2
- **后端**: Express + Anthropic SDK
- **存储**: localStorage

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，填入你的 Anthropic API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001
```

### 3. 启动开发服务器

需要同时启动前端和后端：

**终端 1 - 前端**：
```bash
npm run dev
```

**终端 2 - 后端代理**：
```bash
npm run server
```

### 4. 访问应用

打开浏览器访问：http://localhost:5173

## 项目结构

```
health-assistant-web/
├── src/
│   ├── components/          # React 组件
│   │   ├── Dashboard.jsx    # 首页仪表盘
│   │   ├── RecordForm.jsx   # 数据录入表单
│   │   ├── RecordList.jsx   # 记录列表
│   │   ├── WeightChart.jsx  # 体重折线图
│   │   ├── StatCards.jsx    # 统计卡片
│   │   ├── AIAdvice.jsx     # AI 建议
│   │   ├── Settings.jsx     # 设置页面
│   │   └── ProfileSetup.jsx # 用户档案设置
│   ├── utils/
│   │   ├── storage.js       # localStorage 管理
│   │   ├── calculations.js  # 计算函数（BMI 等）
│   │   └── api.js           # API 调用
│   ├── App.jsx              # 主应用
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── server.js                # Express 代理服务
├── .env.example             # 环境变量模板
└── package.json
```

## 使用说明

### 首次使用

1. 打开应用后，首先设置个人档案（身高、年龄、性别、目标体重）
2. 点击"录入"标签，添加第一条健康记录
3. 首页会显示统计卡片和趋势图表
4. 点击"建议"标签，获取 AI 健康建议

### 数据管理

- **导出数据**：设置 → 数据管理 → 导出数据（下载 JSON 文件）
- **导入数据**：设置 → 数据管理 → 导入数据（选择之前导出的 JSON 文件）
- **清空数据**：设置 → 数据管理 → 清空所有数据（需二次确认）

### AI 建议

AI 建议功能需要配置 Anthropic API Key。如果不配置，可以跳过此功能，其他功能正常使用。

获取 API Key：https://console.anthropic.com/

## 部署

### 本地构建

```bash
npm run build
npm run preview
```

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量 `ANTHROPIC_API_KEY`
4. 部署完成

注意：需要配置 Vercel Functions 来运行 server.js

## 常见问题

**Q: 数据会丢失吗？**
A: 数据存储在浏览器 localStorage 中，只要不清除浏览器数据就不会丢失。建议定期导出备份。

**Q: 可以在多个设备同步吗？**
A: 目前不支持云端同步。可以通过导出/导入功能在设备间迁移数据。

**Q: AI 建议生成失败？**
A: 检查：1) 是否配置了 API Key；2) 后端服务是否启动；3) 网络连接是否正常。

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev        # 前端
npm run server     # 后端

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## License

MIT

## 作者

个人学习项目
