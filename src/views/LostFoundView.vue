<template>
  <section class="page">
    <div class="page-header">
      <h1>🔍 失物招领</h1>
      <p>发布或查找遗失物品，互帮互助共建温暖校园。</p>
    </div>

    <EmptyState v-if="lostFounds.length === 0" description="暂无失物招领信息" />

    <div v-else class="list">
      <ItemCard
        v-for="item in lostFounds"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type === 'lost' ? '寻物' : '招领'"
        :tag-type="item.type === 'lost' ? 'warning' : 'success'"
        :location="item.location"
        :time="item.eventTime"
        @click="toDetail(item.id)"
      >
        <template #footer>
          <el-tag size="small" :type="item.type === 'lost' ? 'warning' : 'success'">
            {{ item.itemName }}
          </el-tag>
          <span class="contact">{{ item.contact }}</span>
          <el-tag size="small" :type="item.status === 'open' ? 'success' : 'info'" class="status-tag">
            {{ item.status === 'open' ? '进行中' : '已结束' }}
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
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'

const router = useRouter()
const lostFounds = ref<LostFoundItem[]>([])

onMounted(async () => {
  try {
    const res = await getLostFounds()
    lostFounds.value = res.data
  } catch (err) {
    console.error('获取失物招领数据失败:', err)
  }
})

function toDetail(id: number) {
  router.push({ name: 'detail', params: { id }, query: { type: 'lostFound' } })
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

.contact {
  color: var(--color-text-muted);
  font-size: 13px;
}

.status-tag {
  margin-left: auto;
}
</style>
