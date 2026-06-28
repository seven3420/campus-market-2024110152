<template>
  <div class="app-root">
    <!-- Element Plus 水平导航菜单，开启router自动跳转 -->
    <el-menu
      mode="horizontal"
      router
      :default-active="$route.path"
      class="nav-menu"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/list">列表页</el-menu-item>
      <el-menu-item index="/publish">发布页</el-menu-item>
      <el-menu-item index="/message">消息页</el-menu-item>
      <el-menu-item index="/profile">个人中心</el-menu-item>
      <el-menu-item index="/board">看板</el-menu-item>
    </el-menu>

    <!-- 路由页面渲染出口 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>

<style scoped>
.app-root {
  padding: 10px;
}
.nav-menu {
  margin-bottom: 20px;
}
</style>
