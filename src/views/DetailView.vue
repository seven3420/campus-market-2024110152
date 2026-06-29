<template>
  <section class="page" v-loading="loading">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: typeRoute }">{{ typeLabel }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ item?.title || '详情' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="item" class="detail-card">
      <!-- 图片区 -->
      <div class="detail-image" v-if="itemImage">
        <img :src="itemImage" :alt="item.title" />
      </div>
      <div v-else class="detail-image-placeholder">
        <span>{{ typeIcon }}</span>
      </div>

      <!-- 信息区 -->
      <div class="detail-body">
        <div class="detail-header">
          <h1>{{ item.title }}</h1>
          <el-tag :type="statusType" size="large">{{ statusLabel }}</el-tag>
        </div>

        <!-- 价格/酬劳醒目展示 -->
        <div class="highlight" v-if="highlightText">
          <span class="highlight-value">{{ highlightText }}</span>
          <span class="highlight-label">{{ highlightLabel }}</span>
        </div>

        <!-- 描述 -->
        <div class="detail-desc">
          <h3>详细描述</h3>
          <p>{{ item.description }}</p>
        </div>

        <!-- 元信息 -->
        <div class="detail-meta">
          <div class="meta-card" v-for="m in metaList" :key="m.label">
            <span class="meta-icon">{{ m.icon }}</span>
            <div>
              <span class="meta-label">{{ m.label }}</span>
              <span class="meta-value">{{ m.value }}</span>
            </div>
          </div>
        </div>

        <!-- 操作栏 -->
        <div class="detail-actions">
          <el-button type="primary" size="large" @click="contactPublisher">
            💬 联系发布人
          </el-button>
          <el-button size="large" @click="toggleFavorite">
            {{ isFavorited ? '⭐ 已收藏' : '☆ 收藏' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 未找到 -->
    <div v-else-if="!loading" class="not-found">
      <EmptyState description="未找到该信息" />
      <el-button type="primary" @click="$router.back()">返回上一页</el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import { getTradeById, type TradeItem } from '@/api/trade'
import { getLostFoundById, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuyById, type GroupBuyItem } from '@/api/groupBuy'
import { getErrandById, type ErrandItem } from '@/api/errand'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

type DetailItem = TradeItem | LostFoundItem | GroupBuyItem | ErrandItem

const loading = ref(true)
const item = ref<DetailItem | null>(null)
const isFavorited = ref(false)

const itemType = (route.query.type as string) || 'trade'
const itemId = Number(route.params.id)

const typeMap: Record<string, { label: string; route: string; icon: string; fetch: (id: number) => Promise<any> }> = {
  trade: { label: '二手交易', route: '/trade', icon: '🛒', fetch: getTradeById },
  lostFound: { label: '失物招领', route: '/lost-found', icon: '🔍', fetch: getLostFoundById },
  groupBuy: { label: '拼单搭子', route: '/group-buy', icon: '👥', fetch: getGroupBuyById },
  errand: { label: '跑腿委托', route: '/errand', icon: '🏃', fetch: getErrandById },
}

const typeInfo = computed(() => typeMap[itemType] || typeMap.trade)
const typeLabel = computed(() => typeInfo.value?.label || '详情')
const typeRoute = computed(() => typeInfo.value?.route || '/')
const typeIcon = computed(() => typeInfo.value?.icon || '📄')

const itemImage = computed(() => {
  if (!item.value) return ''
  const i = item.value as any
  return i.image || ''
})

const statusLabel = computed(() => {
  if (!item.value) return ''
  const s = item.value.status
  const map: Record<string, string> = { open: '进行中', closed: '已结束', done: '已完成' }
  return map[s] || s
})

const statusType = computed(() => {
  if (!item.value) return 'info'
  const s = item.value.status
  if (s === 'open') return 'success'
  if (s === 'closed') return 'info'
  if (s === 'done') return ''
  return 'info'
})

const highlightText = computed(() => {
  if (!item.value) return ''
  const i = item.value as any
  if (itemType === 'trade') return `￥${i.price || 0}`
  if (itemType === 'errand') return `￥${i.reward || 0}`
  if (itemType === 'groupBuy') return `${i.currentCount || 0}/${i.targetCount || 0}人`
  return ''
})

const highlightLabel = computed(() => {
  if (itemType === 'trade') return '价格'
  if (itemType === 'errand') return '酬劳'
  if (itemType === 'groupBuy') return '拼单进度'
  return ''
})

const metaList = computed(() => {
  if (!item.value) return []
  const i = item.value as any
  const list: { icon: string; label: string; value: string }[] = []

  if (itemType === 'trade') {
    list.push({ icon: '📦', label: '成色', value: i.condition || '' })
    list.push({ icon: '📂', label: '分类', value: i.category || '' })
  }
  if (itemType === 'lostFound') {
    list.push({ icon: '🏷️', label: '类型', value: i.type === 'lost' ? '寻物启事' : '失物招领' })
    list.push({ icon: '📦', label: '物品', value: i.itemName || '' })
  }
  if (itemType === 'groupBuy') {
    list.push({ icon: '🏷️', label: '类型', value: i.type || '' })
  }
  if (itemType === 'errand') {
    list.push({ icon: '🏷️', label: '类型', value: i.taskType || '' })
    list.push({ icon: '📍', label: '路线', value: `${i.from || ''} → ${i.to || ''}` })
  }

  list.push({ icon: '📍', label: '地点', value: i.location || '' })
  list.push({ icon: '👤', label: '发布人', value: i.publisher || '' })
  list.push({ icon: '🕐', label: '时间', value: i.publishTime || i.eventTime || i.deadline || '' })
  if (i.contact) list.push({ icon: '📞', label: '联系方式', value: i.contact })

  return list
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await typeInfo.value!.fetch(itemId)
    item.value = res.data
  } catch (err) {
    console.error('获取详情失败:', err)
  } finally {
    loading.value = false
  }
})

function contactPublisher() {
  ElMessage.success('已跳转到消息页面，开始与发布人聊天')
  router.push('/message')
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
  ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
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

.detail-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.detail-image {
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: var(--color-bg);
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-image-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #f5f3ff);
  font-size: 72px;
}

.detail-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.detail-header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
}

.highlight {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fef2f2, #fff7ed);
  border-radius: var(--radius-md);
}

.highlight-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-danger);
}

.highlight-label {
  font-size: 14px;
  color: var(--color-text-muted);
}

.detail-desc h3 {
  font-size: 16px;
  color: var(--color-text);
  margin: 0 0 8px;
}

.detail-desc p {
  color: var(--color-text-secondary);
  line-height: 1.8;
  font-size: 15px;
  margin: 0;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.meta-card {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  align-items: center;
}

.meta-icon {
  font-size: 20px;
}

.meta-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
}

.meta-value {
  display: block;
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
