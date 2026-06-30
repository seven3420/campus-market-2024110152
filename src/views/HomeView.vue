<template>
  <section class="home-page">
    <!-- 欢迎横幅 -->
    <div class="hero-banner">
      <div class="hero-content">
        <h1>🏪 校园轻集市</h1>
        <p class="hero-slogan">轻量 · 可信 · 校园生活</p>
        <p class="hero-desc">二手交易 · 失物招领 · 拼单搭子 · 跑腿委托 — 校园生活一站式平台</p>
        <div class="hero-stats">
          <span>🛒 {{ stats.trades }} 件二手好物</span>
          <span>🔍 {{ stats.lostFounds }} 条招领信息</span>
          <span>👥 {{ stats.groupBuys }} 个拼单</span>
          <span>🏃 {{ stats.errands }} 条跑腿任务</span>
        </div>
      </div>
    </div>

    <!-- 分类入口 -->
    <div class="category-grid">
      <router-link to="/trade" class="category-card trade">
        <span class="card-icon">🛒</span>
        <span class="card-label">二手交易</span>
        <span class="card-desc">书籍、数码、生活用品</span>
        <span class="card-count">{{ stats.trades }} 件在售</span>
      </router-link>
      <router-link to="/lost-found" class="category-card lost">
        <span class="card-icon">🔍</span>
        <span class="card-label">失物招领</span>
        <span class="card-desc">寻找遗失物品</span>
        <span class="card-count">{{ stats.lostFounds }} 条信息</span>
      </router-link>
      <router-link to="/group-buy" class="category-card group">
        <span class="card-icon">👥</span>
        <span class="card-label">拼单搭子</span>
        <span class="card-desc">一起拼更划算</span>
        <span class="card-count">{{ stats.groupBuys }} 个拼单</span>
      </router-link>
      <router-link to="/errand" class="category-card errand">
        <span class="card-icon">🏃</span>
        <span class="card-label">跑腿委托</span>
        <span class="card-desc">代取快递、代办事务</span>
        <span class="card-count">{{ stats.errands }} 条任务</span>
      </router-link>
    </div>

    <!-- 热门推荐 -->
    <div class="section" v-if="hotItems.length > 0">
      <h2 class="section-title">🔥 热门推荐</h2>
      <div class="hot-grid">
        <ItemCard
          v-for="item in hotItems"
          :key="`${item._type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :image="(item as any).image"
          :tag="item._tag"
          :location="(item as any).location || (item as any).from"
          :time="(item as any).publishTime || (item as any).eventTime || (item as any).deadline"
          @click="toDetail(item.id, item._type)"
        >
          <template #footer>
            <strong v-if="(item as any).price" class="price">
              ￥{{ (item as any).price }}
            </strong>
            <strong v-if="(item as any).reward" class="price">
              酬劳 ￥{{ (item as any).reward }}
            </strong>
            <span v-if="(item as any).targetCount" class="progress">
              已拼 {{ (item as any).currentCount }}/{{ (item as any).targetCount }} 人
            </span>
          </template>
        </ItemCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'

const router = useRouter()

const stats = ref({ trades: 0, lostFounds: 0, groupBuys: 0, errands: 0 })

interface HotItem {
  id: number
  title: string
  description: string
  _type: string
  _tag: string
  [key: string]: any
}

const hotItems = ref<HotItem[]>([])

onMounted(async () => {
  try {
    const [tradesRes, lostRes, groupRes, errandRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])

    stats.value.trades = tradesRes.data.length
    stats.value.lostFounds = lostRes.data.length
    stats.value.groupBuys = groupRes.data.length
    stats.value.errands = errandRes.data.length

    // 混合热门推荐
    const mix: HotItem[] = [
      ...tradesRes.data.map((t) => ({ ...t, _type: 'trade', _tag: t.category })),
      ...lostRes.data.map((l) => ({ ...l, _type: 'lostFound', _tag: l.type === 'lost' ? '寻物' : '招领' })),
      ...groupRes.data.map((g) => ({ ...g, _type: 'groupBuy', _tag: g.type })),
      ...errandRes.data.map((e) => ({ ...e, _type: 'errand', _tag: e.taskType })),
    ]
    // 随机取 4 条
    hotItems.value = mix.sort(() => Math.random() - 0.5).slice(0, 4)
  } catch (err) {
    console.error('首页数据加载失败:', err)
  }
})

function toDetail(id: number, type: string) {
  router.push({ name: 'detail', params: { id }, query: { type } })
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* 欢迎横幅 */
.hero-banner {
  background: linear-gradient(135deg, #5b9bd5 0%, #818cf8 50%, #e77c8e 100%);
  border-radius: var(--radius-lg);
  padding: 44px 40px;
  color: #fff;
  box-shadow: var(--shadow-lg);
}

.hero-content h1 {
  margin: 0 0 8px;
  font-size: 32px;
}

.hero-slogan {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 8px;
  letter-spacing: 4px;
}

.hero-desc {
  font-size: 14px;
  opacity: 0.8;
  margin: 0 0 20px;
}

.hero-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 13px;
  opacity: 0.85;
}

/* 分类卡片 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 16px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.category-card.trade { background: linear-gradient(135deg, #e8f4fd, #d4eafc); }
.category-card.lost { background: linear-gradient(135deg, #fffbeb, #fef3c7); }
.category-card.group { background: linear-gradient(135deg, #ecfdf5, #d1fae5); }
.category-card.errand { background: linear-gradient(135deg, #fef2f2, #fecaca); }

.card-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.card-label {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.card-count {
  font-size: 12px;
  color: var(--color-primary);
  background: rgba(255,255,255,0.7);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

/* 热门推荐 */
.section {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 18px;
  margin: 0 0 16px;
  color: var(--color-text);
}

.hot-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.price {
  font-size: 17px;
  color: var(--color-danger);
  font-weight: 700;
}

.progress {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 600;
}
</style>
