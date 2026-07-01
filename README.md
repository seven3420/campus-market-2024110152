# 校园轻集市

## 1. 项目简介

"校园轻集市"是一个面向高校校园生活场景的 PC 端 Web App，主要支持二手交易、失物招领、拼单搭子、跑腿委托等校园生活功能。

本项目是《校园轻集市》AI 辅助前端工程实践课程的实训成果，基于 Vue 3 全家桶 + JSON Server Mock 后端完成，覆盖了从项目初始化、页面骨架搭建、数据建模、列表渲染、表单提交、状态管理到交互优化的完整前端开发流程。

## 2. 技术栈

- **Vue 3** — 组合式 API + `<script setup>` 语法
- **Vite** — 构建工具
- **TypeScript** — 类型检查
- **Vue Router** — 路由导航
- **Pinia** — 状态管理
- **Axios** — HTTP 请求
- **JSON Server** — Mock 后端接口
- **Element Plus** — UI 组件库

## 3. 核心功能

- 首页：展示平台统计数据和分类入口，随机推荐热门信息
- 二手交易：商品列表展示、价格/成色/状态标签、收藏切换、跳转详情
- 失物招领：寻物与招领信息列表、类型标签区分
- 拼单搭子：拼单列表展示、已拼/目标人数进度
- 跑腿委托：任务列表展示、酬劳/地点信息
- 信息发布：支持四种类型信息发布（二手、失物、拼单、跑腿），含表单校验
- 发布成功后自动跳转到对应列表页
- 用户中心：展示用户资料、我的收藏列表（支持取消收藏）
- 收藏功能：列表页收藏/取消收藏，个人中心查看收藏
- 消息中心：消息列表展示
- 详情页：查看信息详细内容
- 看板页：统计数据概览
- 空状态提示：列表无数据时展示引导提示
- 错误处理：接口请求失败时控制台报错 + 用户提示

## 4. 项目运行

### 安装依赖

```bash
npm install
```

### 启动 Mock 服务

```bash
npm run mock
```

Mock 服务运行在 `http://localhost:3001`。

### 启动前端项目

新开一个终端：

```bash
npm run dev
```

浏览器访问 `http://localhost:5173`。

### 构建项目

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 类型检查

```bash
npm run type-check
```

### Lint 检查

```bash
npm run lint
```

## 5. 项目目录说明

```
campus-market-seed
├── db.json                  # JSON Server Mock 数据
├── src/
│   ├── api/                 # 接口请求模块
│   │   ├── http.ts          # Axios 实例配置
│   │   ├── trade.ts         # 二手交易 API
│   │   ├── lostFound.ts     # 失物招领 API
│   │   ├── groupBuy.ts      # 拼单搭子 API
│   │   ├── errand.ts        # 跑腿委托 API
│   │   ├── message.ts       # 消息 API
│   │   └── user.ts          # 用户 API
│   ├── assets/              # 静态资源（全局样式）
│   ├── components/          # 公共组件
│   │   ├── AppHeader.vue    # 顶部导航栏
│   │   ├── AppLayout.vue    # 页面布局容器
│   │   ├── AppNav.vue       # 侧边导航
│   │   ├── EmptyState.vue   # 空状态提示
│   │   ├── FormField.vue    # 表单字段容器
│   │   └── ItemCard.vue     # 信息卡片组件
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由表（含动态路由）
│   ├── stores/              # Pinia 状态管理
│   │   ├── user.ts          # 用户状态 Store
│   │   └── favorite.ts      # 收藏状态 Store
│   ├── views/               # 页面组件
│   │   ├── HomeView.vue     # 首页
│   │   ├── TradeView.vue    # 二手交易列表
│   │   ├── LostFoundView.vue # 失物招领列表
│   │   ├── GroupBuyView.vue # 拼单搭子列表
│   │   ├── ErrandView.vue   # 跑腿委托列表
│   │   ├── PublishView.vue  # 信息发布页
│   │   ├── MessageView.vue  # 消息中心
│   │   ├── UserCenterView.vue # 个人中心
│   │   ├── DetailView.vue   # 详情页
│   │   └── BoardView.vue    # 看板页
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── docs/
│   ├── evidence/            # 每日证据卡（Day1-Day7）
│   ├── ai/                  # AI 协作记录
│   └── guide/               # 课程指南
├── package.json
└── README.md
```

## 6. 每日开发记录

| 天数 | 主题 | 主要内容 |
|------|------|----------|
| Day1 | 项目启动与业务梳理 | 页面清单、功能规划 |
| Day2 | 页面骨架与路由导航 | 多页面布局、导航栏、路由配置 |
| Day3 | Mock 数据与列表渲染 | JSON Server 数据、API 封装、列表展示 |
| Day4 | 发布表单与数据新增 | 表单校验、四种类型发布、数据提交 |
| Day5 | 状态管理与用户中心 | Pinia Store、收藏功能、用户资料展示 |
| Day6 | 交互优化与体验完善 | 空状态提示、错误处理、收藏交互优化 |
| Day7 | 综合验收与项目展示 | 文档完善、构建检查、功能走查、AI 复盘 |

## 7. AI 协作说明

本项目在开发过程中使用 AI Coding 工具辅助完成页面骨架搭建、Mock 数据生成、接口封装、表单设计、状态管理和交互优化等工作。

开发者对所有 AI 生成内容进行了人工审查、修改和取舍，包括但不限于：
- 调整字段使其贴合校园业务场景
- 删除超出范围的功能（如登录认证、图片上传）
- 修正过度复杂的代码实现
- 统一命名规范和代码风格

具体 AI 协作过程记录在 `docs/ai/AI_Collaboration_Card.md` 和 `docs/evidence/` 每日证据卡中。

## 8. 项目限制与后续改进

- 当前使用 JSON Server 模拟后端，非真实后端服务
- 用户状态为前端模拟，非真实登录认证
- 收藏数据存储在 Pinia 内存中，刷新页面后会丢失
- 图片上传功能尚未实现
- 搜索功能较为基础
- 页面样式在移动端适配方面还有优化空间
