<template>
  <section class="page">
    <div class="page-header">
      <h1>📊 数据看板</h1>
      <p>校园轻集市整体数据概览</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="stat in stats" :key="stat.label">
        <div class="stat-card" :style="{ background: stat.bg }">
          <span class="stat-icon">{{ stat.icon }}</span>
          <div class="stat-info">
            <span class="stat-num">{{ stat.count }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 最新发布 + 分类占比 -->
    <el-row :gutter="16" style="margin-top: 20px">
      <el-col :span="14">
        <div class="panel">
          <h3>🆕 最新发布</h3>
          <div class="latest-list">
            <div v-for="item in latestItems" :key="`${item.type}-${item.id}`" class="latest-item">
              <span class="latest-type">{{ item.typeIcon }}</span>
              <div class="latest-body">
                <span class="latest-title">{{ item.title }}</span>
                <span class="latest-meta">{{ item.publisher }} · {{ item.time }}</span>
              </div>
              <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small">
                {{ item.status === 'open' ? '进行中' : '已结束' }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="panel">
          <h3>📈 分类统计</h3>
          <div class="category-stats">
            <div class="category-stat-item">
              <span class="cat-label">🛒 二手交易</span>
              <el-progress :percentage="stats[0] ? Math.round(stats[0].count / totalCount * 100) : 0" :color="'#5b9bd5'" />
            </div>
            <div class="category-stat-item">
              <span class="cat-label">🔍 失物招领</span>
              <el-progress :percentage="stats[1] ? Math.round(stats[1].count / totalCount * 100) : 0" :color="'#f59e0b'" />
            </div>
            <div class="category-stat-item">
              <span class="cat-label">👥 拼单搭子</span>
              <el-progress :percentage="stats[2] ? Math.round(stats[2].count / totalCount * 100) : 0" :color="'#10b981'" />
            </div>
            <div class="category-stat-item">
              <span class="cat-label">🏃 跑腿委托</span>
              <el-progress :percentage="stats[3] ? Math.round(stats[3].count / totalCount * 100) : 0" :color="'#e74c3c'" />
            </div>
          </div>
        </div>

        <div class="panel" style="margin-top: 16px">
          <h3>💬 消息动态</h3>
          <div class="msg-stats">
            <div class="msg-stat">
              <span class="msg-num">{{ unreadTotal }}</span>
              <span class="msg-label">未读消息</span>
            </div>
            <div class="msg-stat">
              <span class="msg-num">{{ activeConversations }}</span>
              <span class="msg-label">活跃会话</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'
import { getConversations } from '@/api/message'

interface LatestItem {
  id: number
  title: string
  type: string
  typeIcon: string
  publisher: string
  time: string
  status: string
}

const stats = ref([
  { icon: '🛒', label: '二手交易', count: 0, bg: 'linear-gradient(135deg, #e8f4fd, #d4eafc)' },
  { icon: '🔍', label: '失物招领', count: 0, bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)' },
  { icon: '👥', label: '拼单搭子', count: 0, bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' },
  { icon: '🏃', label: '跑腿委托', count: 0, bg: 'linear-gradient(135deg, #fef2f2, #fecaca)' },
])

const latestItems = ref<LatestItem[]>([])
const unreadTotal = ref(0)
const activeConversations = ref(0)

const totalCount = computed(() => stats.value.reduce((s, st) => s + st.count, 0))

onMounted(async () => {
  try {
    const [tradesRes, lostRes, groupRes, errandRes, convRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
      getConversations(),
    ])

    if (stats.value[0]) stats.value[0].count = tradesRes.data.length
    if (stats.value[1]) stats.value[1].count = lostRes.data.length
    if (stats.value[2]) stats.value[2].count = groupRes.data.length
    if (stats.value[3]) stats.value[3].count = errandRes.data.length

    // 合并最新发布
    const all: LatestItem[] = [
      ...tradesRes.data.map((t) => ({ id: t.id, title: t.title, type: 'trade', typeIcon: '🛒', publisher: t.publisher, time: t.publishTime, status: t.status })),
      ...lostRes.data.map((l) => ({ id: l.id, title: l.title, type: 'lostFound', typeIcon: '🔍', publisher: l.contact, time: l.eventTime, status: l.status })),
      ...groupRes.data.map((g) => ({ id: g.id, title: g.title, type: 'groupBuy', typeIcon: '👥', publisher: g.publisher, time: g.deadline, status: g.status })),
      ...errandRes.data.map((e) => ({ id: e.id, title: e.title, type: 'errand', typeIcon: '🏃', publisher: e.publisher, time: e.deadline, status: e.status })),
    ]
    // 按时间降序排列（简单字符串排序）
    all.sort((a, b) => b.time.localeCompare(a.time))
    latestItems.value = all.slice(0, 6)

    unreadTotal.value = convRes.data.reduce((s, c) => s + c.unread, 0)
    activeConversations.value = convRes.data.filter((c) => c.targetUserId !== 1).length
  } catch (err) {
    console.error('看板数据加载失败:', err)
  }
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--color-card);
  box-shadow: var(--shadow-sm);
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: var(--color-text);
}

.page-header p {
  margin: 0;
  color: var(--color-text-secondary);
}

/* 统计卡片 */
.stat-card {
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* 面板 */
.panel {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.panel h3 {
  margin: 0 0 14px;
  font-size: 16px;
  color: var(--color-text);
}

/* 最新发布 */
.latest-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.latest-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.latest-item:hover {
  background: var(--color-bg);
}

.latest-type {
  font-size: 20px;
  flex-shrink: 0;
}

.latest-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.latest-title {
  font-size: 14px;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-meta {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* 分类统计 */
.category-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* 消息统计 */
.msg-stats {
  display: flex;
  gap: 24px;
}

.msg-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.msg-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}

.msg-label {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
