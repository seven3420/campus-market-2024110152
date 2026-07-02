<template>
  <section class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <p>发布或查找遗失物品，互帮互助共建温暖校园。</p>
    </div>

    <div class="search-row">
      <SearchBar
        v-model="keyword"
        placeholder="搜索标题、物品名称、地点或描述"
      />
      <select v-model="typeFilter" class="type-filter">
        <option value="">全部类型</option>
        <option value="lost">寻物</option>
        <option value="found">招领</option>
      </select>
    </div>

    <LoadingState
      v-if="loading"
      text="正在加载失物招领信息..."
    />

    <ErrorState
      v-else-if="error"
      message="失物招领数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadLostFounds"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      description="暂无符合条件的失物招领信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'

const router = useRouter()
const lostFounds = ref<LostFoundItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')
const typeFilter = ref('')

const filteredItems = computed(() => {
  return lostFounds.value.filter((item) => {
    const matchType = !typeFilter.value || item.type === typeFilter.value

    const value = keyword.value.trim()
    const matchKeyword =
      !value ||
      item.title.includes(value) ||
      item.itemName.includes(value) ||
      item.location.includes(value) ||
      item.description.includes(value)

    return matchType && matchKeyword
  })
})

async function loadLostFounds() {
  loading.value = true
  error.value = false

  try {
    const res = await getLostFounds()
    lostFounds.value = res.data
  } catch (err) {
    console.error('获取失物招领数据失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLostFounds()
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

.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-row .search-bar {
  flex: 1;
}

.type-filter {
  width: 140px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  background: #fff;
  cursor: pointer;
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
