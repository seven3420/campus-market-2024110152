<template>
  <section class="page">
    <div class="page-header">
      <h1>二手交易</h1>
      <p>浏览同学发布的闲置物品，发现校园内的实用好物。</p>
    </div>

    <SearchBar
      v-model="keyword"
      placeholder="搜索商品标题、分类、地点或描述"
    />

    <LoadingState
      v-if="loading"
      text="正在加载二手交易信息..."
    />

    <ErrorState
      v-else-if="error"
      message="二手交易数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadTrades"
    />

    <EmptyState
      v-else-if="filteredTrades.length === 0"
      description="暂无符合条件的二手交易信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredTrades"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :image="item.image"
        :tag="item.category"
        :location="item.location"
        :time="item.publishTime"
        @click="toDetail(item.id)"
      >
        <template #footer>
          <strong class="price">￥{{ item.price }}</strong>
          <el-tag size="small" :type="item.condition === '全新' ? 'success' : ''">
            {{ item.condition }}
          </el-tag>
          <button
            class="favorite-btn"
            :class="{ active: favoriteStore.isFavorite('trade', item.id) }"
            @click.stop="favoriteStore.toggleFavorite({
              id: item.id,
              type: 'trade',
              title: item.title,
              description: item.description,
              location: item.location
            })"
          >
            {{ favoriteStore.isFavorite('trade', item.id) ? '❤️ 已收藏' : '🤍 收藏' }}
          </button>
          <el-tag size="small" :type="item.status === 'open' ? 'success' : 'info'" class="status-tag">
            {{ item.status === 'open' ? '在售' : '已售' }}
          </el-tag>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getTrades, type TradeItem } from '@/api/trade'
import { useFavoriteStore } from '@/stores/favorite'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const trades = ref<TradeItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredTrades = computed(() => {
  const value = keyword.value.trim()

  if (!value) {
    return trades.value
  }

  return trades.value.filter((item) => {
    return (
      item.title.includes(value) ||
      item.category.includes(value) ||
      item.location.includes(value) ||
      item.description.includes(value)
    )
  })
})

async function loadTrades() {
  loading.value = true
  error.value = false

  try {
    const res = await getTrades()
    trades.value = res.data
  } catch (err) {
    console.error('获取二手交易数据失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTrades()
})

function toDetail(id: number) {
  router.push({ name: 'detail', params: { id }, query: { type: 'trade' } })
}
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

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.price {
  font-size: 18px;
  color: var(--color-danger);
}

.favorite-btn {
  margin-left: 6px;
  border: none;
  border-radius: 999px;
  padding: 5px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 13px;
  transition: background var(--transition);
}

.favorite-btn:hover {
  background: #fee2e2;
}

.favorite-btn.active {
  background: #dbeafe;
  color: #2563eb;
}

.status-tag {
  margin-left: auto;
}
</style>
