<template>
  <section class="page">
    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <div class="avatar">
        {{ userStore.currentUser.avatar }}
      </div>

      <div class="profile-info">
        <h1>{{ userStore.displayName }}</h1>
        <p class="profile-desc">{{ userStore.userDescription }}</p>
        <p class="profile-bio">{{ userStore.currentUser.bio }}</p>
        <div class="profile-tags">
          <el-tag size="small">{{ userStore.currentUser.college }}</el-tag>
          <el-tag size="small" type="info">{{ userStore.currentUser.grade }}</el-tag>
        </div>
      </div>
    </div>

    <!-- 我的发布 -->
    <div class="panel">
      <h2>📋 我的发布</h2>
      <p class="hint">
        本模块用于展示当前用户发布过的信息。Day5 阶段可先完成结构展示，后续可继续与接口数据联动。
      </p>
      <EmptyState description="我的发布功能将在后续版本中完善" />
    </div>

    <!-- 我的收藏 -->
    <div class="panel">
      <h2>⭐ 我的收藏（{{ favoriteStore.favoriteCount }}）</h2>

      <EmptyState
        v-if="favoriteStore.favorites.length === 0"
        description="暂无收藏内容，去二手交易页面收藏感兴趣的商品吧"
      />

      <div v-else class="favorite-list">
        <ItemCard
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="getTypeLabel(item.type)"
          :location="item.location"
        >
          <template #footer>
            <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">
              取消收藏
            </button>
          </template>
        </ItemCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import EmptyState from '../components/EmptyState.vue'
import ItemCard from '../components/ItemCard.vue'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }

  return map[type] || '校园信息'
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

.profile-card,
.panel {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
  box-shadow: var(--shadow-sm);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #5b9bd5, #818cf8);
  color: #fff;
  font-size: 32px;
  flex-shrink: 0;
}

.profile-info h1 {
  margin: 0 0 6px;
  font-size: 22px;
}

.profile-desc {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.profile-bio {
  margin: 4px 0 8px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.6;
}

.profile-tags {
  display: flex;
  gap: 6px;
}

.panel h2 {
  margin: 0 0 8px;
  font-size: 16px;
}

.hint {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.favorite-list {
  display: grid;
  gap: 12px;
}

.remove-btn {
  border: none;
  border-radius: 999px;
  padding: 5px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 13px;
  transition: background var(--transition);
}

.remove-btn:hover {
  background: #fee2e2;
}
</style>
