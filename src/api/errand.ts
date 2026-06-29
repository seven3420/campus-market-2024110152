import http from './http'

/** 跑腿委托数据接口 */
export interface ErrandItem {
  id: number
  title: string
  taskType: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  status: string
  description: string
}

/** 获取所有跑腿委托数据 */
export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

/** 根据 id 获取单条跑腿委托详情 */
export function getErrandById(id: number) {
  return http.get<ErrandItem>(`/errands/${id}`)
}
