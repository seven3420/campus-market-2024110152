import axios from 'axios'

// 创建 Axios 实例，配置基础地址和超时时间
const http = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
})

export default http
