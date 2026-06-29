<template>
  <article class="item-card" @click="$emit('click')">
    <div v-if="image" class="item-card__image">
      <img :src="image" :alt="title" />
    </div>

    <div class="item-card__body">
      <div class="item-card__header">
        <h3>{{ title }}</h3>
        <el-tag v-if="tag" size="small" :type="tagType" effect="plain">
          {{ tag }}
        </el-tag>
      </div>

      <p class="description">{{ description }}</p>

      <div class="meta">
        <span v-if="location">📍 {{ location }}</span>
        <span v-if="time">🕐 {{ time }}</span>
      </div>

      <div v-if="$slots.footer" class="footer">
        <slot name="footer" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  image?: string
  tag?: string
  tagType?: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  location?: string
  time?: string
}>()

defineEmits<{
  click: []
}>()

const tagType = computed(() => props.tagType || 'primary')
</script>

<style scoped>
.item-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--color-card);
  border: 1px solid var(--color-border);
  transition: all var(--transition);
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.item-card__image {
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-bg);
}

.item-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.item-card__header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  display: flex;
  gap: 14px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.footer {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
