<template>
  <section class="page">
    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <div class="profile-main">
        <el-avatar :size="72" style="background: linear-gradient(135deg, #2563eb, #7c3aed); font-size: 32px">
          {{ user.avatar }}
        </el-avatar>
        <div class="profile-info">
          <h2>{{ user.nickname }}</h2>
          <p class="profile-bio">{{ user.bio }}</p>
          <div class="profile-tags">
            <el-tag size="small">{{ user.school }}</el-tag>
            <el-tag size="small" type="info">{{ user.grade }}</el-tag>
          </div>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-num">{{ user.publishedCount }}</span>
          <span class="stat-label">发布</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ user.collectedCount }}</span>
          <span class="stat-label">收藏</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ user.messageCount }}</span>
          <span class="stat-label">消息</span>
        </div>
      </div>
    </div>

    <!-- 我的发布 -->
    <div class="section">
      <h3 class="section-title">📋 我的发布</h3>
      <div class="my-publish-list">
        <div v-for="item in myItems" :key="item.id" class="my-publish-item">
          <div class="item-info">
            <span class="item-type-tag">{{ item.typeLabel }}</span>
            <span class="item-title">{{ item.title }}</span>
          </div>
          <div class="item-right">
            <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small">
              {{ item.status === 'open' ? '进行中' : '已结束' }}
            </el-tag>
            <span class="item-date">{{ item.time }}</span>
          </div>
        </div>
        <EmptyState v-if="myItems.length === 0" description="还没有发布过信息" />
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="section">
      <h3 class="section-title">⚙️ 功能</h3>
      <div class="menu-grid">
        <div class="menu-item" v-for="m in menuItems" :key="m.label" @click="onMenuClick(m.label)">
          <span class="menu-icon">{{ m.icon }}</span>
          <span class="menu-label">{{ m.label }}</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import { getCurrentUser, type User } from '@/api/user'
import { getTrades } from '@/api/trade'
import { getGroupBuys } from '@/api/groupBuy'
import { getLostFounds } from '@/api/lostFound'
import { getErrands } from '@/api/errand'
import { ElMessage } from 'element-plus'

const user = ref<User>({
  id: 1,
  nickname: '小王同学',
  avatar: '🎓',
  school: '计算机学院',
  grade: '2023级',
  bio: '爱分享、爱交易的校园人',
  publishedCount: 0,
  collectedCount: 5,
  messageCount: 8,
})

interface MyItem {
  id: number
  title: string
  typeLabel: string
  status: string
  time: string
}

const myItems = ref<MyItem[]>([])

const menuItems = [
  { icon: '⭐', label: '我的收藏' },
  { icon: '👁️', label: '浏览历史' },
  { icon: '🔔', label: '消息通知' },
  { icon: '📊', label: '数据看板' },
  { icon: '❓', label: '帮助中心' },
  { icon: 'ℹ️', label: '关于校园轻集市' },
]

onMounted(async () => {
  try {
    const [userRes, tradesRes, , groupRes, errandRes] = await Promise.all([
      getCurrentUser(),
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    user.value = userRes.data

    // 合并所有发布（模拟属于当前用户的）
    const allItems: MyItem[] = [
      ...tradesRes.data
        .filter((t) => t.publisher.includes('软件') || t.publisher.includes('小王'))
        .map((t) => ({ id: t.id, title: t.title, typeLabel: '二手', status: t.status, time: t.publishTime })),
      ...errandRes.data
        .filter((e) => e.publisher.includes('小王') || e.publisher.includes('西区'))
        .map((e) => ({ id: e.id, title: e.title, typeLabel: '跑腿', status: e.status, time: e.deadline })),
      ...groupRes.data
        .filter((g) => g.publisher.includes('小王') || g.publisher.includes('计算机'))
        .map((g) => ({ id: g.id, title: g.title, typeLabel: '拼单', status: g.status, time: g.deadline })),
    ]
    myItems.value = allItems.slice(0, 5)
    user.value.publishedCount = allItems.length
  } catch (err) {
    console.error('获取用户数据失败:', err)
  }
})

function onMenuClick(label: string) {
  ElMessage.info(`功能"${label}"将在后续版本中开放`)
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* 个人信息卡片 */
.profile-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-sm);
}

.profile-main {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
}

.profile-info h2 {
  margin: 0 0 6px;
  font-size: 22px;
  color: var(--color-text);
}

.profile-bio {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0 0 8px;
}

.profile-tags {
  display: flex;
  gap: 6px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--color-border-light);
}

/* 区块 */
.section {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 16px;
  color: var(--color-text);
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-light);
}

/* 我的发布列表 */
.my-publish-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.my-publish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.my-publish-item:hover {
  background: var(--color-bg);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-type-tag {
  font-size: 11px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.item-title {
  font-size: 14px;
  color: var(--color-text);
}

.item-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-date {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* 功能菜单 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid transparent;
}

.menu-item:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

.menu-icon {
  font-size: 18px;
}

.menu-label {
  font-size: 14px;
  color: var(--color-text);
  flex: 1;
}

.menu-arrow {
  font-size: 18px;
  color: var(--color-text-muted);
}
</style>
