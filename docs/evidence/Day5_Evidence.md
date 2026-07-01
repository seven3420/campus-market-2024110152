# Day5 Evidence - 状态管理与用户中心

## 1. 今日完成内容

今天完成了 Pinia 状态管理的引入和用户中心功能的实现：

1. 创建了用户状态 Store（`src/stores/user.ts`），模拟当前用户信息；
2. 创建了收藏状态 Store（`src/stores/favorite.ts`），管理收藏列表；
3. 更新了导航栏组件 `AppHeader.vue`，显示当前用户头像和名称；
4. 更新了发布页面 `PublishView.vue`，publisher 字段改为读取当前用户状态；
5. 更新了二手交易列表 `TradeView.vue`，支持收藏和取消收藏；
6. 重写了个人中心页面 `UserCenterView.vue`，展示用户资料、我的收藏和我的发布结构；
7. 服务端 API 仍然使用 JSON Server，不涉及真实用户认证。

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|---|---|---|---|
| src/stores/user.ts | 当前用户信息 | isLoggedIn、currentUser（id、name、college、grade、avatar、bio） | updateProfile、login、logout |
| src/stores/favorite.ts | 收藏状态 | favorites（FavoriteItem 数组） | addFavorite、removeFavorite、toggleFavorite、isFavorite |

### userStore 设计

- **state**: `isLoggedIn` 标记登录状态（Day5 模拟为 true），`currentUser` 存储用户基本信息和简介
- **getters**: `displayName` 返回用户名称，`userDescription` 返回学院+年级组合描述
- **actions**: `updateProfile` 支持局部更新用户信息，`login`/`logout` 切换登录状态

### favoriteStore 设计

- **state**: `favorites` 存储收藏项数组，每项包含 id、type（业务类型）、title、description、location
- **getters**: `favoriteCount` 返回收藏总数
- **actions**: `isFavorite` 判断是否已收藏，`addFavorite` 添加收藏，`removeFavorite` 移除收藏，`toggleFavorite` 切换收藏状态

## 3. 状态边界说明

哪些数据放入了 Store，哪些没有，以及原因：

| 数据 | 是否放入 Store | 原因 |
|---|---|---|
| 当前用户信息 | ✅ 是 | 导航栏、发布页、个人中心等多处需要使用 |
| 收藏列表 | ✅ 是 | 列表页和个人中心都需要使用，需要跨页面共享 |
| 表单校验错误信息 | ❌ 否 | 只属于发布页面内部，不需要跨页面共享 |
| 页面临时输入内容 | ❌ 否 | 只属于当前页面，无跨页面共享需求 |
| 接口返回的列表数据 | ❌ 否 | 每个页面独立获取，不需要全局共享 |
| 消息会话列表 | ❌ 否 | 当前只在 MessageView 中使用，暂无需跨页面 |
| 发布类型选择 | ❌ 否 | 仅 PublishView.vue 内部使用 |

核心原则：**Store 只存放多个页面或组件需要共享的状态**，临时页面状态保持在组件内部。

## 4. 页面使用记录

Store 在以下页面/组件中被使用：

- **AppHeader.vue**: 使用 `useUserStore` 读取 `currentUser.avatar` 和 `displayName`，在导航栏右侧显示用户头像和名称
- **PublishView.vue**: 使用 `useUserStore` 读取 `displayName` 作为发布人（publisher 字段），替代了 Day4 的硬编码 `'当前用户'`
- **TradeView.vue**: 使用 `useFavoriteStore` 实现收藏/取消收藏按钮，`toggleFavorite` 切换收藏状态，`isFavorite` 判断是否已收藏
- **UserCenterView.vue**: 同时使用 `useUserStore` 和 `useFavoriteStore`，展示用户资料卡片和收藏列表

## 5. AI 协作记录

- **AI 工具**: Claude Code（通过 VS Code 插件）
- **核心提示词**: 上传了 Day5 的完整实训说明文档，要求 Claude 根据已有项目代码结构完成 Day5 全部任务
- **AI 生成内容**:
  - `src/stores/user.ts` 用户状态 Store
  - `src/stores/favorite.ts` 收藏状态 Store
  - `AppHeader.vue` 的 store 集成修改
  - `PublishView.vue` 的 publisher 字段修改
  - `TradeView.vue` 的收藏按钮添加
  - `UserCenterView.vue` 的完整重写
- **不合理内容**: AI 在阅读已有代码后，生成的内容基本合理。UserCenterView 原有的 API 调用方式（通过 getCurrentUser 等）被替换为 Pinia Store 读取方式，符合 Day5 的教学目标

## 6. 人工调整内容

1. 保持了 `AppHeader.vue` 原有的消息未读徽章功能，仅在用户信息部分接入 userStore
2. `PublishView.vue` 中的 4 种发布类型（trade、lostFound、groupBuy、errand）的 publisher 字段全部从 `'当前用户'` 改为 `userStore.displayName`
3. 保持了项目的 Element Plus UI 风格，收藏按钮使用 el-tag 类似的圆角样式
4. `UserCenterView.vue` 从原来的 API 直接调用模式改为完全依赖 Pinia Store
5. 将"我的发布"改为结构占位（Day5 阶段不强制实现完整查询），提示后续版本完善
6. 收藏按钮使用 `@click.stop` 阻止事件冒泡，避免触发卡片点击跳转

## 7. 测试记录

### 测试流程

1. 启动 Mock 服务：`npm run mock`（终端 1）
2. 启动前端服务：`npm run dev`（终端 2）
3. 打开浏览器访问 `http://localhost:5173`

### 测试结果

| 测试项 | 操作 | 预期结果 | 实际结果 |
|---|---|---|---|
| 导航栏用户显示 | 查看页面顶部导航栏 | 显示用户头像和名称 | ✅ 显示 🎓 + "小王同学" |
| 发布页读取用户 | 进入发布页面发布二手商品 | publisher 为当前用户名 | ✅ publisher 为 "小王同学" |
| 收藏按钮显示 | 进入二手交易页面 | 每个卡片有收藏按钮 | ✅ 显示 "🤍 收藏" |
| 收藏功能 | 点击收藏按钮 | 按钮变为 "❤️ 已收藏" | ✅ 正常切换 |
| 个人中心收藏 | 进入个人中心 | 看到已收藏的商品 | ✅ 显示收藏列表 |
| 取消收藏 | 在个人中心点击取消收藏 | 商品从收藏列表消失 | ✅ 正常移除 |
| 发布后跳转 | 发布商品后查看列表 | 新商品出现在二手交易列表 | ✅ 正常显示 |

## 8. 遇到的问题与解决方法

**问题 1: UserCenterView.vue 中原有的 API 调用逻辑与 Pinia Store 定位冲突**

原有的 `UserCenterView.vue` 通过 `getCurrentUser()` 等 API 调用获取用户数据，并在 `onMounted` 中通过复杂的 `Promise.all` 聚合四类数据来筛选"我的发布"。这与 Day5 引入 Pinia 状态管理的目标存在冲突。

**解决方法**: 将 `UserCenterView.vue` 重写为完全依赖 Pinia Store 的模式。用户信息直接从 `useUserStore` 读取，收藏列表从 `useFavoriteStore` 读取。"我的发布"部分保留为结构占位，标注 Day5 阶段可先完成结构展示，后续再与接口数据联动。这更清晰地体现了"Store 管理跨页面共享状态"的设计理念。

**问题 2: 收藏按钮点击冒泡导致页面跳转**

在 ItemCard 上点击收藏按钮时，由于卡片本身有 `@click` 事件（跳转详情页），点击收藏按钮也会触发卡片点击跳转到详情页。

**解决方法**: 在收藏按钮上添加 `@click.stop` 阻止事件冒泡，确保点击收藏按钮只触发收藏操作而不会跳转。

**问题 3: 收藏数据刷新后丢失**

刷新页面后，通过 Pinia 管理的收藏数据会被重置为空数组。

**说明**: 这是 Day5 阶段可接受的现象。当前收藏状态属于前端临时状态，保存在 Pinia 内存中。后续如需持久化，可以结合 localStorage 或后端接口保存。Day5 不强制实现持久化。

## 9. 今日反思

Pinia 状态管理对多页面前端应用的核心价值在于**解决了跨页面/跨组件的数据共享问题**。在 Day2-Day4 阶段，每个页面各自管理自己的数据，页面之间通过路由参数传递少量信息。但当应用规模扩大，用户信息、收藏状态等数据需要在多个不相关的页面和组件中保持一致时，如果没有统一的状态管理，就只能通过 props 层层传递或者各自重复获取，导致代码耦合度高、数据不一致风险大。

通过今天的实践，可以清晰地看到状态管理的边界：不是所有数据都需要放入 Store。表单输入、临时 UI 状态等只属于单个页面的数据，放在组件内部更合适。Store 应该只管理**真正需要跨页面共享**的状态，这个边界的判断是前端架构能力的重要组成部分。

Day5 的 Store 设计——用户状态（userStore）和收藏状态（favoriteStore）分离——也体现了单一职责原则。每个 Store 只管理一类相关的状态，避免了把所有全局状态堆在一起的问题，为后续 Day6 的交互优化和功能扩展打下了良好的基础。
