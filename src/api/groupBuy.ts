import http from './http'

/** 拼单搭子数据接口 */
export interface GroupBuyItem {
  id: number
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  status: string
  description: string
}

/** 获取所有拼单搭子数据 */
export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

/** 根据 id 获取单条拼单搭子详情 */
export function getGroupBuyById(id: number) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}
