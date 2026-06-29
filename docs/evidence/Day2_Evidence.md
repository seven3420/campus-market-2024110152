# Day2 Evidence — 页面骨架与路由导航

## 1. 今日完成内容

本日完成了"校园轻集市"PC 端 Web App 的前端页面骨架搭建与路由导航实现。具体包括：

- 在 `src/views/` 目录下创建/完善了 8 个核心业务页面：首页、二手交易、失物招领、拼单搭子、跑腿委托、发布信息、消息中心、个人中心
- 在 `src/components/` 目录下创建了 3 个公共布局组件：AppLayout.vue（整体页面布局）、AppHeader.vue（顶部区域）、AppNav.vue（导航菜单）
- 在 `src/router/index.ts` 中完成了 Vue Router 基础路由配置，所有路由均添加了 `meta.title` 元信息
- 在 `main.ts` 中挂载了 Pinia 状态管理和 Vue Router
- 创建了 `src/assets/main.css` 全局基础样式文件

## 2. 页面与路由清单

| 页面名称 | 路由路径 | 文件位置 |
|---|---|---|
| 首页 | / | src/views/HomeView.vue |
| 二手交易 | /trade | src/views/TradeView.vue |
| 失物招领 | /lost-found | src/views/LostFoundView.vue |
| 拼单搭子 | /group-buy | src/views/GroupBuyView.vue |
| 跑腿委托 | /errand | src/views/ErrandView.vue |
| 发布信息 | /publish | src/views/PublishView.vue |
| 消息中心 | /message | src/views/MessageView.vue |
| 个人中心 | /user | src/views/UserCenterView.vue |
| 详情页 | /detail/:id | src/views/DetailView.vue |
| 看板 | /board | src/views/BoardView.vue |

## 3. AI 协作记录

### 使用的 AI 工具
- Claude Code（Anthropic），通过 VS Code 扩展使用

### 核心提示词
向 AI 提供了 Day2 完整实训文档，包括页面清单、推荐目录结构、路由配置示例、布局组件示例等详细规范，要求 AI 按照实训要求逐步检查并完善项目。

### AI 生成/修改的内容
1. **公共布局组件**（AppLayout.vue、AppHeader.vue、AppNav.vue）：AI 按照实训文档推荐代码创建，使用 RouterLink 实现导航跳转
2. **UserCenterView.vue**：AI 参照其他页面的结构风格创建
3. **PublishView.vue / MessageView.vue**：原文件仅有一行占位 H1 标签，AI 将其补充为包含标题和业务说明的完整页面骨架
4. **路由配置重写**：AI 将原有路由重构，添加 `meta.title`，修复首页路由（`/` 直接渲染 HomeView 而非重定向到 `/home`），新增 `/user` 路由指向 UserCenterView，保留 `/profile` 兼容重定向
5. **App.vue 重构**：AI 将原来直接使用 Element Plus el-menu 的实现替换为 AppLayout 布局组件包装
6. **main.ts 更新**：AI 添加了 Pinia 状态管理的挂载
7. **assets/main.css**：AI 创建了全局基础样式文件

### 人工检查与修改内容
1. **路由路径核对**：逐条检查路由 path、name、component 三元组的对应关系，确认无拼写和路径错误
2. **导航链接验证**：检查 AppNav.vue 中所有 RouterLink 的 `to` 属性与路由 path 一致
3. **页面名称确认**：检查每个页面的 H1 标题是否与业务场景匹配
4. **代码简洁性审查**：确认页面组件仅包含基础结构，无过度封装、无 Mock 数据、无复杂业务逻辑
5. **TypeScript 类型检查**：运行 `vue-tsc --build --noEmit` 确认无类型错误
6. **构建验证**：运行 `vite build` 确认项目可正常构建
7. **旧路由清理**：移除了不再使用的 `/list` 路由（ListView）

## 4. 遇到的问题与解决方法

### 问题 1：`src/assets/` 目录不存在导致构建失败

**现象**：`main.ts` 中引入了 `import './assets/main.css'`，但 `src/assets/` 目录不存在，构建时报错找不到模块。

**原因**：项目在 Day1 初始化时未创建 assets 目录和 main.css 文件，main.ts 中的引用是预先添加但对应的文件未创建。

**解决方法**：
1. 手动创建 `src/assets/` 目录
2. 创建 `main.css` 文件，包含全局 box-sizing、字体、背景色等基础样式
3. 重新构建确认通过

### 问题 2：导航高亮与路由不完全匹配

**现象**：原路由中 `/` 重定向到 `/home`，但导航中 RouterLink 使用 `to="/"`，导致首页导航高亮与实际访问路径不一致。

**解决方法**：将路由配置修改为 `/` 直接渲染 HomeView 组件，移除了多余的重定向，使导航高亮与实际路由路径完全对应。

### 问题 3：AI 前期生成的代码超出 Day2 范围

**现象**：项目在之前阶段已引入 Element Plus UI 框架，App.vue 直接使用 el-menu 实现导航，部分页面（如 TradeView）已包含 API 调用和复杂组件引用。

**处理方式**：按照 Day2 要求创建了自定义布局组件（AppLayout/AppHeader/AppNav），将 App.vue 改为使用自定义布局。保留了 Element Plus 的全局注册（后续 Day 可能需要），但在布局层面使用自建组件确保结构清晰、符合教学要求。对于 TradeView 等已包含 API 调用的页面，暂未删除其业务代码（作为后续开发基础），但核心页面骨架和路由结构已完全对齐 Day2 规范。

## 5. 今日反思

页面骨架、路由导航和公共布局是前端项目的基础设施，对后续开发有着决定性的影响。

**页面骨架**的作用在于为整个应用建立清晰的空间边界——每个页面有自己的文件、自己的路由、自己的职责范围。如果没有预先规划好页面骨架，后续开发中很容易出现"一个文件塞入多个页面逻辑"或"随意创建新页面导致路由混乱"的问题。今天的 8 个核心页面覆盖了校园轻集市的主要业务场景，后续只需在各个页面中逐步填充功能和数据。

**路由导航**决定了用户如何在页面之间流动。统一使用 Vue Router 的 RouterLink 而非原生 `<a>` 标签，保证了页面切换不会触发浏览器整页刷新，保持了 SPA 的用户体验。路由的 `meta.title` 字段为后续的页面标题自动设置、权限控制和导航高亮提供了扩展点。

**公共布局**实现了"一次定义、全局复用"。AppLayout、AppHeader、AppNav 三个组件的分离使得布局、头部和导航各司其职——如果要修改导航菜单项，只需编辑 AppNav.vue；如果要调整整体布局样式，只需修改 AppLayout.vue。这种组件边界清晰的设计避免了在每个页面中重复编写布局代码，也为后续添加侧边栏、底部栏等扩展留下了空间。

总的来说，Day2 不追求页面的视觉精美或功能完整，而是追求结构清晰、路径明确、组件边界合理——这正是后续所有功能开发的坚实基础。
