<template>
  <nav class="app-nav">
    <RouterLink to="/" class="nav-link">🏠 首页</RouterLink>
    <RouterLink to="/trade" class="nav-link">🛒 二手交易</RouterLink>
    <RouterLink to="/lost-found" class="nav-link">🔍 失物招领</RouterLink>
    <RouterLink to="/group-buy" class="nav-link">👥 拼单搭子</RouterLink>
    <RouterLink to="/errand" class="nav-link">🏃 跑腿委托</RouterLink>
    <RouterLink to="/publish" class="nav-link publish-link">➕ 发布</RouterLink>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-nav {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-link {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition);
  position: relative;
}

.nav-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  font-weight: 600;
}

.publish-link {
  background: var(--color-primary);
  color: #fff !important;
  padding: 6px 16px;
  font-weight: 600;
}

.publish-link:hover {
  background: var(--color-primary-dark);
  color: #fff !important;
}

.publish-link.router-link-active {
  background: var(--color-primary-dark);
  color: #fff !important;
}
</style>
