import http from './http'

/** 二手交易数据接口 */
export interface TradeItem {
  id: number
  title: string
  category: string
  price: number
  condition: string
  location: string
  publisher: string
  publishTime: string
  image: string
  status: string
  description: string
}

/** 获取所有二手交易数据 */
export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

/** 根据 id 获取单条二手交易详情 */
export function getTradeById(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}
