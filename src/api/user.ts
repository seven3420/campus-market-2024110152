import http from './http'

/** 用户数据接口 */
export interface User {
  id: number
  nickname: string
  avatar: string
  school: string
  grade: string
  bio: string
  publishedCount: number
  collectedCount: number
  messageCount: number
}

/** 获取当前用户（默认 id=1） */
export function getCurrentUser() {
  return http.get<User>('/users/1')
}

/** 根据 id 获取用户信息 */
export function getUserById(id: number) {
  return http.get<User>(`/users/${id}`)
}
