import http from './http'

/** 用户数据接口 */
export interface User {
  id?: number
  username: string
  password: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
}

/** 获取所有用户（登录校验用） */
export function getUsers() {
  return http.get<User[]>('/users')
}

/** 注册新用户 */
export function createUser(data: User) {
  return http.post<User>('/users', data)
}
