import http from './http'

/** 会话数据接口 */
export interface Conversation {
  id: number
  userId: number
  targetUserId: number
  targetName: string
  targetAvatar: string
  lastMessage: string
  lastTime: string
  unread: number
  relatedItem: string
}

/** 消息数据接口 */
export interface Message {
  id: number
  conversationId: number
  senderId: number
  text: string
  time: string
}

/** 获取当前用户的所有会话 */
export function getConversations() {
  return http.get<Conversation[]>('/conversations')
}

/** 获取指定会话的消息列表 */
export function getMessages(conversationId: number) {
  return http.get<Message[]>(`/messages?conversationId=${conversationId}`)
}

/** 发送消息（模拟） */
export function sendMessage(conversationId: number, senderId: number, text: string) {
  return http.post<Message>('/messages', {
    conversationId,
    senderId,
    text,
    time: new Date().toLocaleString('zh-CN', { hour12: false }),
  })
}
