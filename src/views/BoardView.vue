<template>
  <!-- 统一单根容器包裹所有内容 -->
  <div class="root">
    <h1>BoardView</h1>
    <div class="board-wrap">
      <h2>校园集市数据看板</h2>
      <div class="stat-row">
        <div class="stat-card">
          <div class="label">在售商品总量</div>
          <div class="num">156</div>
        </div>
        <div class="stat-card">
          <div class="label">今日交易订单</div>
          <div class="num">42</div>
        </div>
        <div class="stat-card">
          <div class="label">在校活跃用户</div>
          <div class="num">278</div>
        </div>
        <div class="stat-card">
          <div class="label">待审核商品</div>
          <div class="num">9</div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 补充ts脚本标签，消除eslint警告 -->
<script setup lang="ts">
// 看板为纯静态页面，无业务逻辑，留空即可
</script>

<style scoped>
.root {
  padding: 10px;
}
.board-wrap {
  padding: 30px;
}
.stat-row {
  display: flex;
  gap: 20px;
  margin-top: 24px;
}
.stat-card {
  background: #f0f4ff;
  padding: 26px 32px;
  border-radius: 10px;
  text-align: center;
  min-width: 130px;
}
.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
.num {
  font-size: 30px;
  font-weight: bold;
  color: #409eff;
}
</style>
