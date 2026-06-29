<template>
  <div class="message-page">
    <!-- 左侧会话列表 -->
    <aside class="conversation-panel">
      <div class="panel-header">
        <h2>消息中心</h2>
        <el-input
          v-model="searchText"
          placeholder="搜索会话..."
          prefix-icon="Search"
          size="small"
          clearable
        />
      </div>

      <div class="conversation-list" v-loading="loading">
        <div
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="conversation-item"
          :class="{ active: activeConv?.id === conv.id }"
          @click="selectConversation(conv)"
        >
          <div class="conv-avatar">
            <el-badge :value="conv.unread" :hidden="conv.unread === 0" :max="99">
              <span class="avatar-text">{{ conv.targetAvatar }}</span>
            </el-badge>
          </div>
          <div class="conv-body">
            <div class="conv-header">
              <span class="conv-name">{{ conv.targetName }}</span>
              <span class="conv-time">{{ conv.lastTime.slice(5) }}</span>
            </div>
            <div class="conv-preview">
              <span class="conv-last-msg">{{ conv.lastMessage }}</span>
            </div>
            <div class="conv-related">{{ conv.relatedItem }}</div>
          </div>
        </div>

        <EmptyState v-if="filteredConversations.length === 0 && !loading" description="暂无会话" />
      </div>
    </aside>

    <!-- 右侧聊天区域 -->
    <main class="chat-panel">
      <!-- 未选择会话 -->
      <div v-if="!activeConv" class="chat-empty">
        <span class="chat-empty-icon">💬</span>
        <p>选择一个会话开始聊天</p>
      </div>

      <!-- 聊天内容 -->
      <template v-else>
        <div class="chat-header">
          <span class="chat-target-avatar">{{ activeConv.targetAvatar }}</span>
          <div class="chat-target-info">
            <strong>{{ activeConv.targetName }}</strong>
            <span class="chat-related">关于：{{ activeConv.relatedItem }}</span>
          </div>
        </div>

        <div class="chat-messages" ref="msgContainer">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-bubble"
            :class="{ 'is-self': msg.senderId === currentUserId }"
          >
            <div class="bubble-text">{{ msg.text }}</div>
            <div class="bubble-time">{{ msg.time.slice(5) }}</div>
          </div>
          <EmptyState v-if="messages.length === 0" description="暂无消息，发送第一条消息吧" />
        </div>

        <div class="chat-input-bar">
          <el-input
            v-model="newMessage"
            placeholder="输入消息..."
            @keyup.enter="handleSend"
            size="large"
          >
            <template #append>
              <el-button type="primary" @click="handleSend" :disabled="!newMessage.trim()">
                发送
              </el-button>
            </template>
          </el-input>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import {
  getConversations,
  getMessages,
  sendMessage,
  type Conversation,
  type Message,
} from '@/api/message'

const searchText = ref('')
const loading = ref(false)
const conversations = ref<Conversation[]>([])
const activeConv = ref<Conversation | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const currentUserId = 1
const msgContainer = ref<HTMLElement>()

const filteredConversations = computed(() => {
  if (!searchText.value) return conversations.value
  const kw = searchText.value.toLowerCase()
  return conversations.value.filter(
    (c) =>
      c.targetName.toLowerCase().includes(kw) ||
      c.lastMessage.toLowerCase().includes(kw) ||
      c.relatedItem.toLowerCase().includes(kw),
  )
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getConversations()
    conversations.value = res.data
    // 默认选中第一个会话
    if (conversations.value.length > 0 && conversations.value[0]) {
      await selectConversation(conversations.value[0])
    }
  } catch (err) {
    console.error('获取会话失败:', err)
  } finally {
    loading.value = false
  }
})

async function selectConversation(conv: Conversation) {
  activeConv.value = conv
  try {
    const res = await getMessages(conv.id)
    messages.value = res.data
    // 标记已读
    conv.unread = 0
    await nextTick()
    scrollToBottom()
  } catch (err) {
    console.error('获取消息失败:', err)
  }
}

async function handleSend() {
  const text = newMessage.value.trim()
  if (!text || !activeConv.value) return

  try {
    await sendMessage(activeConv.value.id, currentUserId, text)
    // 乐观更新本地消息列表
    messages.value.push({
      id: Date.now(),
      conversationId: activeConv.value.id,
      senderId: currentUserId,
      text,
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    })
    // 更新会话最后消息
    activeConv.value.lastMessage = text
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } catch (err) {
    console.error('发送消息失败:', err)
  }
}

function scrollToBottom() {
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.message-page {
  display: flex;
  height: calc(100vh - 64px - 48px);
  background: var(--color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* ===== 左侧会话列表 ===== */
.conversation-panel {
  width: 340px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid var(--color-border-light);
}

.panel-header h2 {
  margin: 0 0 12px;
  font-size: 20px;
  color: var(--color-text);
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background var(--transition);
  border-bottom: 1px solid var(--color-border-light);
}

.conversation-item:hover {
  background: var(--color-bg);
}

.conversation-item.active {
  background: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
}

.conv-avatar {
  flex-shrink: 0;
  padding-top: 2px;
}

.avatar-text {
  font-size: 32px;
  line-height: 1;
}

.conv-body {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

.conv-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.conv-preview {
  margin-bottom: 4px;
}

.conv-last-msg {
  font-size: 13px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.conv-related {
  font-size: 11px;
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: 1px 8px;
  border-radius: var(--radius-full);
  display: inline-block;
}

/* ===== 右侧聊天区域 ===== */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.chat-empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.chat-empty p {
  font-size: 16px;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-card);
}

.chat-target-avatar {
  font-size: 36px;
}

.chat-target-info strong {
  display: block;
  font-size: 16px;
  color: var(--color-text);
}

.chat-related {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* 消息气泡区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 65%;
  align-self: flex-start;
}

.message-bubble.is-self {
  align-self: flex-end;
}

.bubble-text {
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.message-bubble:not(.is-self) .bubble-text {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-bottom-left-radius: 4px;
}

.message-bubble.is-self .bubble-text {
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.bubble-time {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 4px;
  padding: 0 4px;
}

.message-bubble.is-self .bubble-time {
  text-align: right;
}

/* 输入栏 */
.chat-input-bar {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-card);
}
</style>
