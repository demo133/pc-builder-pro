# PC Builder Pro — 智能装机选型助手

> 一站式电脑硬件选型、性能评估、游戏帧数预测、价格监控、配置推荐与兼容性分析平台

**在线体验**：https://pc-builder-pro-nine.vercel.app

---

## 核心功能

| 模块 | 说明 |
|------|------|
| 🔧 **装机选择器** | 8 大硬件分类自由搭配，实时总价计算，一键导出配置清单 |
| ⚡ **性能估测评分** | CPU/GPU/内存/存储四维评分，0-100 综合分，自动识别瓶颈（低U高显等） |
| 🎮 **游戏帧数预测** | 8 款热门游戏（CS2/无畏契约/原神/赛博朋克等）1080P & 2K 高画质帧数估算 |
| ⚖️ **硬件参数对比** | 同品类两款硬件逐项对比，优势参数自动高亮，一键选择装入配置 |
| 💰 **双平台价格监控** | 京东 + 天猫价格对比，点击直达商城搜索页 |
| 🎯 **预算智能推荐** | 输入预算与用途，生成 3 套配置方案（丐版/均衡/加钱）+ 预算分配饼图 |
| 🩺 **兼容性体检** | 15 项规则检查（插槽/内存/电源/尺寸/高U低显等），0-100 分评分 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 16 + React 19 + TypeScript |
| 样式方案 | Tailwind CSS 4 + 自定义 shadcn/ui 组件（蓝绿极简主题） |
| 数据库 | Prisma ORM + PostgreSQL（Prisma Postgres） |
| 图表 | Recharts |
| 部署 | Vercel（含 Cron 定时任务） |
| 爬虫 | Python + Playwright（本地定时爬取京东价格） |

---

## 快速开始

### 环境要求
- Node.js ≥ 18
- Python ≥ 3.10（爬虫可选）

### 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 DATABASE_URL

# 3. 数据库迁移
npx prisma migrate dev

# 4. 导入种子数据（241 款硬件 + 3 套配置）
npx tsx prisma/seed.ts

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 项目结构

```
pc-builder/
├── prisma/
│   ├── schema.prisma          # 数据库模型（5 张表）
│   ├── seed.ts                # 种子数据（241 款硬件）
│   └── seed-tmall.ts          # 天猫参考价补充
├── crawler/
│   ├── jd_crawler.py          # 京东价格爬虫（Playwright）
│   └── run_crawler.bat        # 爬虫运行脚本
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页（Hero + 数据统计 + 功能卡片）
│   │   ├── builder/page.tsx   # 装机选择器（含性能评分/游戏帧数/硬件对比）
│   │   ├── recommend/page.tsx # 预算推荐（滑块 + 3套方案 + 饼图）
│   │   ├── prices/page.tsx    # 价格监控（双平台价格对比）
│   │   └── api/
│   │       ├── hardware/      # 硬件列表 API（多筛选 + 双平台价格）
│   │       ├── recommend/     # 配置推荐 API
│   │       └── cron/          # Vercel Cron 定时更新
│   ├── components/
│   │   ├── PerformanceScore.tsx   # 性能评分组件（环形图 + 分项进度条）
│   │   ├── GameBenchmark.tsx      # 游戏帧数预测组件
│   │   ├── HardwareCompare.tsx    # 硬件对比组件
│   │   ├── CompatibilityReport.tsx # 兼容性报告
│   │   ├── Navbar.tsx             # 导航栏
│   │   └── ui/                    # shadcn/ui 基础组件
│   └── lib/
│       ├── prisma.ts          # Prisma 客户端
│       ├── compatibility.ts   # 兼容性检查引擎（15 项规则）
│       ├── performance.ts     # 性能评估 + 游戏帧数预测引擎
│       └── utils.ts
└── vercel.json                # Vercel 配置（含 Cron）
```

---

## 性能评估引擎

`src/lib/performance.ts` 实现了完整的性能评估模型：

- **CPU 评分**：基于核心数、线程数、睿频、架构代际
- **GPU 评分**：基于型号定位、显存、架构
- **内存评分**：基于容量、频率、代数（DDR4/DDR5）
- **存储评分**：基于容量、接口（PCIe 3.0/4.0/5.0）
- **瓶颈检测**：自动识别低U高显、高U低显、内存瓶颈
- **游戏帧数模型**：以 RTX 4060 + i5-12400F 为基准（CPU 55分 / GPU 50分），按性能比例缩放

覆盖游戏：CS2、无畏契约、英雄联盟、原神、绝地求生、赛博朋克2077、永劫无间、APEX英雄

---

## 数据库设计

5 张核心表：

- **Hardware** — 硬件库（241 款，8 大品类）
- **Price** — 价格记录（京东/天猫双平台，关联硬件）
- **PresetConfig** — 预置配置方案（按预算/用途/偏好）
- **CompatibilityRule** — 兼容性规则
- **CrawlTask** — 爬取任务状态

---

## 价格爬虫

### 本地爬虫（推荐）
真实浏览器爬取京东价格，反爬优化（长延迟+分批+重试）。

```bash
# 安装依赖
pip install playwright psycopg2-binary
playwright install chromium

# 运行爬虫
python crawler/jd_crawler.py
```

已配置 Windows 定时任务，每天凌晨 3:00 自动运行。

### Vercel Cron（备用）
Serverless 定时函数，每天 UTC 3:00 自动触发，受限于京东动态加载，目前作为框架预留。

---

## 部署

### Vercel 一键部署

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 配置环境变量：
   - `DATABASE_URL` — PostgreSQL 连接字符串
   - `CRON_SECRET` — Cron 验证密钥
4. 部署完成

### 数据库
推荐使用 [Prisma Postgres](https://www.prisma.io/postgres) 免费版，区域选 Washington D.C.

---

## 硬件库

当前收录 **241 款**市面热门硬件：

| 品类 | 数量 | 代表型号 |
|------|------|----------|
| CPU | 31 | i3-12100F ~ i9-14900K，R3 4100 ~ R9 7950X |
| 显卡 | 30 | RTX 3050 ~ RTX 5090，RX 6600 ~ RX 7900 XTX |
| 主板 | 30 | LGA1700/AM5/AM4，H/B/Z/X/A 全系 |
| 内存 | 30 | DDR4/DDR5，8G~64G，多品牌 |
| SSD | 30 | 500G~4TB，PCIe 3.0/4.0/5.0 |
| 电源 | 30 | 400W~1500W，金牌/白金/钛金 |
| 机箱 | 30 | M-ATX/ATX/E-ATX/ITX |
| 散热器 | 30 | 风冷/水冷，120~360 冷排 |

扩充硬件库：编辑 `prisma/seed.ts` 后运行 `npx tsx prisma/seed.ts`

---

## 设计风格

- **配色**：白底 + 浅灰卡片 + 蓝绿色（#00b4a8）强调色，苹果式极简
- **动效**：页面入场淡入、卡片悬浮上浮、按钮按压反馈、滚动渐显、数字计数动画
- **交互**：所有可点击元素均有过渡动画，弹窗平滑缩放
- **响应式**：大屏左右布局，小屏上下堆叠

---

## 相关制作工具

| 工具 | 用途 |
|------|------|
| Cursor | AI 辅助代码编写 |
| 豆包 | 需求分析、架构设计、代码生成、调试部署 |
| Prisma Studio | 数据库可视化管理 `npx prisma studio` |
| Playwright | 浏览器自动化爬虫 |
| Vercel | 部署 + Cron 定时任务 |
| GitHub | 代码托管 + 版本控制 |

---

## License

MIT
