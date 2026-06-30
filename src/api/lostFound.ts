import http from './http'

/** 失物招领数据接口 */
export interface LostFoundItem {
  id: number
  title: string
  type: 'lost' | 'found'
  itemName: string
  location: string
  eventTime: string
  contact: string
  status: string
  description: string
}

/** 获取所有失物招领数据 */
export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

/** 根据 id 获取单条失物招领详情 */
export function getLostFoundById(id: number) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

/** 新增失物招领数据（id 由 JSON Server 自动生成） */
export function createLostFound(data: Omit<LostFoundItem, 'id'> & { id?: number }) {
  return http.post<LostFoundItem>('/lostFounds', data)
}
