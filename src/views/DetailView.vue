<template>
  <div class="root">
    <h1>DetailView</h1>
    <div class="detail-wrap">
      <h2>商品详情页</h2>
      <p>当前商品ID：{{ route.params.id }}</p>
      <p>这里展示对应ID商品的图文、价格、描述等信息</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
.root {
  padding: 10px;
}
.detail-wrap {
  padding: 20px;
}
</style>
