# PC Builder Pro — 智能装机选型助手

> 一站式电脑硬件选型、价格监控、配置推荐与兼容性分析平台

**在线体验**：https://pc-builder-pro-nine.vercel.app

---

## 核心功能

| 模块 | 说明 |
|------|------|
| 🔧 **装机选择器** | 8 大硬件分类自由搭配，实时总价计算，一键导出配置清单 |
| 💰 **双平台价格监控** | 京东 + 天猫实时价格对比，点击直达商城搜索页 |
| 🎯 **预算智能推荐** | 输入预算与用途，自动生成 3 套配置方案（丐版/均衡/加钱） |
| 🩺 **兼容性体检** | 15 项规则检查（插槽/内存/电源/尺寸/高U低显等），0-100 分评分 |
| 📊 **预算分配分析** | 各硬件占比饼图，科学分配每一分预算 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 16 + React 19 + TypeScript |
| 样式方案 | Tailwind CSS 4 + 自定义 shadcn/ui 组件 |
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
│   │   ├── page.tsx           # 首页
│   │   ├── builder/page.tsx   # 装机选择器
│   │   ├── recommend/page.tsx # 预算推荐
│   │   ├── prices/page.tsx    # 价格监控
│   │   └── api/
│   │       ├── hardware/      # 硬件列表 API
│   │       ├── recommend/     # 配置推荐 API
│   │       └── cron/          # Vercel Cron 定时更新
│   ├── components/            # UI 组件（Navbar/兼容性报告/动画等）
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── compatibility.ts   # 兼容性检查引擎
│   │   └── utils.ts
│   └── components/ui/         # shadcn/ui 基础组件
└── vercel.json                # Vercel 配置（含 Cron）
```

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

## 相关制作工具

| 工具 | 用途 |
|------|------|
| Cursor | AI 辅助代码编写（项目全程由 Cursor + 豆包协作完成） |
| Prisma Studio | 数据库可视化管理 `npx prisma studio` |
| Playwright | 浏览器自动化爬虫 |
| Vercel | 部署 + Cron 定时任务 |
| GitHub | 代码托管 + 版本控制 |

---

## License

MIT
