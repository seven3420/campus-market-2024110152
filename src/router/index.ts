import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/ListView.vue')
    },
    // 动态id参数路由，对应详情页
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/DetailView.vue')
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/PublishView.vue')
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('@/views/MessageView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue')
    },
    {
      path: '/board',
      name: 'board',
      component: () => import('@/views/BoardView.vue')
    }
  ],
})
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

export default router
