# PC Builder Pro — 项目开发指南

## 项目简介
PC 硬件选型助手网站，帮助用户 DIY 装机。核心功能：硬件选择、价格监控、预算推荐、兼容性分析。

## 技术栈
- Next.js 14+ App Router + TypeScript
- shadcn/ui + Tailwind CSS（深色主题，青色主色调）
- Prisma ORM + SQLite（开发）/ PostgreSQL（生产）
- Recharts（图表）
- Python + Playwright（爬虫，独立 /crawler 目录）

## 快速开始
```bash
pnpm install
npx prisma migrate dev
npx tsx prisma/seed.ts
pnpm dev
```

## 关键目录
- `src/app/` — 页面和 API 路由
- `src/components/` — 可复用组件
- `src/lib/` — 工具函数（compatibility.ts 兼容性检查、power.ts 功耗计算、prisma.ts 数据库实例）
- `prisma/` — 数据库模型和种子数据
- `crawler/` — Python 爬虫（独立运行，不影响前端）
- `.cursor/rules/` — Cursor AI 规则文件

## 编码约定
1. 价格单位统一用"分"，展示时除以 100
2. 硬件参数存在 specs JSON 字段，读取时做可选链保护
3. API 统一返回 `{ success, data, error }` 格式
4. 所有兼容性检查集中在 `src/lib/compatibility.ts`
5. 组件用函数组件 + TypeScript interface 定义 Props
6. 不要用 any，不要手写 SQL，不要引入技术栈外的依赖

## 硬件数据规范
每类硬件的 specs 必填字段见 `.cursor/rules/03-hardware-data.mdc`。
新增硬件时必须确保参数完整准确，不确定的标注 TODO。

## 兼容性规则
检查级别：fatal（-30分）、warning（-10分）、info（-3分）。
完整规则见 `.cursor/rules/04-compatibility-rules.mdc`。

## UI 风格
深色主题，背景 #0a0e1a→#111827，主色青色 #06b6d4。
完整规范见 `.cursor/rules/05-ui-style.mdc`。

## 注意事项
- 用户是代码零基础，代码必须有注释，报错信息要清晰
- 硬件参数必须真实，不要编造
- 每完成一个功能要能在浏览器中验证
- 遇到报错先看完整错误信息再修
