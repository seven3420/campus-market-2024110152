<template>
  <section class="page">
    <!-- 个人信息卡片：未登录时提示登录 -->
    <div v-if="!userStore.isLoggedIn" class="panel not-logged-in">
      <div class="empty-icon">🔒</div>
      <h1>请先登录</h1>
      <p>登录后可以查看个人资料和发布信息。</p>
      <RouterLink class="login-link" to="/login">去登录</RouterLink>
    </div>

    <!-- 个人信息卡片：已登录时展示资料 -->
    <div v-else class="profile-card">
      <div class="avatar">
        {{ userStore.currentUser?.avatar || userStore.displayName.slice(0, 1) }}
      </div>

      <div class="profile-info">
        <h1>{{ userStore.displayName }}</h1>
        <p class="profile-desc">{{ userStore.userDescription }}</p>
        <p class="profile-bio">{{ userStore.currentUser?.bio }}</p>
        <div class="profile-tags">
          <el-tag size="small">{{ userStore.currentUser?.college }}</el-tag>
          <el-tag size="small" type="info">{{ userStore.currentUser?.grade }}</el-tag>
        </div>
      </div>
    </div>

    <!-- 我的发布 -->
    <div class="panel">
      <h2>📋 我的发布</h2>
      <p class="hint">
        本模块用于展示当前用户发布过的信息。
      </p>
      <EmptyState description="我的发布功能将在后续版本中完善" />
    </div>

    <!-- 我的收藏：不依赖登录状态 -->
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

.not-logged-in {
  text-align: center;
  padding: 60px 20px;
}

.not-logged-in .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.not-logged-in h1 {
  margin: 0 0 8px;
  font-size: 20px;
}

.not-logged-in p {
  margin: 0 0 20px;
  color: #6b7280;
}

.login-link {
  display: inline-block;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  transition: background var(--transition);
}

.login-link:hover {
  background: #1d4ed8;
}
</style>
