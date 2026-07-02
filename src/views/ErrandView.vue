<template>
  <section class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
      <p>找人帮忙代办事务，解决校园生活中的燃眉之急。</p>
    </div>

    <SearchBar
      v-model="keyword"
      placeholder="搜索标题、任务类型、取件地点或送达地点"
    />

    <LoadingState
      v-if="loading"
      text="正在加载跑腿委托信息..."
    />

    <ErrorState
      v-else-if="error"
      message="跑腿委托数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadErrands"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      description="暂无符合条件的跑腿委托信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="item.deadline"
        @click="toDetail(item.id)"
      >
        <template #footer>
          <strong class="reward">酬劳 ￥{{ item.reward }}</strong>
          <el-tag size="small" type="info">{{ item.from }} → {{ item.to }}</el-tag>
          <el-tag
            size="small"
            :type="item.status === 'open' ? 'success' : item.status === 'done' ? '' : 'warning'"
            class="status-tag"
          >
            {{ item.status === 'open' ? '待接单' : item.status === 'done' ? '已完成' : '进行中' }}
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
import { getErrands, type ErrandItem } from '@/api/errand'

const router = useRouter()
const errands = ref<ErrandItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredItems = computed(() => {
  const value = keyword.value.trim()

  if (!value) {
    return errands.value
  }

  return errands.value.filter((item) => {
    return (
      item.title.includes(value) ||
      item.taskType.includes(value) ||
      item.from.includes(value) ||
      item.to.includes(value) ||
      item.description.includes(value)
    )
  })
})

async function loadErrands() {
  loading.value = true
  error.value = false

  try {
    const res = await getErrands()
    errands.value = res.data
  } catch (err) {
    console.error('获取跑腿委托数据失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadErrands()
})

function toDetail(id: number) {
  router.push({ name: 'detail', params: { id }, query: { type: 'errand' } })
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

.reward {
  font-size: 18px;
  color: var(--color-danger);
}

.status-tag {
  margin-left: auto;
}
</style>
