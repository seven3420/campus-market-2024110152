<template>
  <section class="page">
    <div class="page-header">
      <h1>🛒 二手交易</h1>
      <p>浏览同学发布的闲置物品，发现校园内的实用好物。</p>
    </div>

    <EmptyState v-if="trades.length === 0" description="暂无二手交易信息" />

    <div v-else class="list">
      <ItemCard
        v-for="item in trades"
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
          <el-tag size="small" :type="item.status === 'open' ? 'success' : 'info'" class="status-tag">
            {{ item.status === 'open' ? '在售' : '已售' }}
          </el-tag>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getTrades, type TradeItem } from '@/api/trade'

const router = useRouter()
const trades = ref<TradeItem[]>([])

onMounted(async () => {
  try {
    const res = await getTrades()
    trades.value = res.data
  } catch (err) {
    console.error('获取二手交易数据失败:', err)
  }
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

.status-tag {
  margin-left: auto;
}
</style>
