<template>
  <section class="page">
    <div class="page-header">
      <h1>👥 拼单搭子</h1>
      <p>找搭子一起拼，更划算更省心。</p>
    </div>

    <EmptyState v-if="groupBuys.length === 0" description="暂无拼单信息" />

    <div v-else class="list">
      <ItemCard
        v-for="item in groupBuys"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
        @click="toDetail(item.id)"
      >
        <template #footer>
          <el-progress
            :percentage="Math.round((item.currentCount / item.targetCount) * 100)"
            :stroke-width="8"
            style="flex: 1; max-width: 140px"
          />
          <span class="count-text">已拼 {{ item.currentCount }}/{{ item.targetCount }} 人</span>
          <el-tag size="small" :type="item.status === 'open' ? 'success' : 'info'" class="status-tag">
            {{ item.status === 'open' ? '拼单中' : '已结束' }}
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
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'

const router = useRouter()
const groupBuys = ref<GroupBuyItem[]>([])

onMounted(async () => {
  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data
  } catch (err) {
    console.error('获取拼单搭子数据失败:', err)
  }
})

function toDetail(id: number) {
  router.push({ name: 'detail', params: { id }, query: { type: 'groupBuy' } })
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

.count-text {
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 500;
  white-space: nowrap;
}

.status-tag {
  margin-left: auto;
}
</style>
