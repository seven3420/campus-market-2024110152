<template>
  <header class="app-header">
    <div class="brand">
      <router-link to="/" class="logo-link">
        <span class="logo-icon">🏪</span>
        <span class="logo-text">校园轻集市</span>
      </router-link>
      <span class="slogan">轻量 · 可信 · 校园生活</span>
    </div>

    <AppNav />

    <div class="header-actions">
      <router-link to="/message" class="action-btn">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99">
          <span class="icon">💬</span>
        </el-badge>
      </router-link>

      <template v-if="userStore.isLoggedIn && userStore.currentUser">
        <router-link to="/user" class="action-btn user-btn">
          <el-avatar :size="32" style="background: #5b9bd5; font-size: 16px">
            {{ userStore.currentUser.avatar || userStore.displayName.slice(0, 1) }}
          </el-avatar>
          <span class="user-name">{{ userStore.displayName }}</span>
        </router-link>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </template>

      <template v-else>
        <router-link to="/login" class="auth-link">登录</router-link>
        <router-link to="/register" class="auth-link register-link">注册</router-link>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNav from './AppNav.vue'
import { getConversations } from '@/api/message'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const unreadCount = ref(0)

onMounted(async () => {
  try {
    const res = await getConversations()
    unreadCount.value = res.data.reduce((sum, c) => sum + c.unread, 0)
  } catch {
    // 使用默认值
  }
})

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-card);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #5b9bd5, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slogan {
  font-size: 12px;
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  transition: background var(--transition);
  text-decoration: none;
}

.action-btn:hover {
  background: var(--color-bg);
}

.action-btn .icon {
  font-size: 20px;
}

.user-btn {
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-name {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.auth-link {
  font-size: 14px;
  color: #2563eb;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.auth-link:hover {
  background: var(--color-primary-light);
}

.register-link {
  background: var(--color-primary);
  color: #fff;
  padding: 6px 16px;
  font-weight: 500;
}

.register-link:hover {
  background: var(--color-primary-dark);
  color: #fff;
}

.logout-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  font-size: 13px;
  transition: background var(--transition);
}

.logout-btn:hover {
  background: #fee2e2;
}
</style>
