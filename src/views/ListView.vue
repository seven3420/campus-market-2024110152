<template>
  <div class="list-wrap">
    <h1>ListView</h1>
    <div class="list-container">
      <h3>商品列表</h3>
      <div class="goods-item" v-for="item in goodsList" :key="item.id">
        <p>商品：{{ item.name }}</p>
        <!-- 声明式跳转携带id -->
        <router-link :to="`/detail/${item.id}`">查看详情</router-link>
        <!-- 编程式跳转按钮 -->
        <button @click="toDetail(item.id)">快速打开</button>
      </div>
    </div>
  </div>
</template>

<!-- 新增 lang="ts" 解决ESLint警告 -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

// 静态模拟商品数据
const goodsList = [
  { id: 1, name: "大学专业教材" },
  { id: 2, name: "无线蓝牙耳机" },
  { id: 3, name: "篮球运动装备" },
  { id: 4, name: "宿舍折叠桌" }
]

// 编程式导航方法
const toDetail = (id: number) => {
  router.push({ name: "detail", params: { id } })
}
</script>

<style scoped>
.list-wrap {
  padding: 10px;
}
.list-container {
  padding: 20px;
}
.goods-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  margin: 10px 0;
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
