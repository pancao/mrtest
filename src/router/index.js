import { createRouter, createWebHistory } from 'vue-router'
import { resourceTypes } from '../config/resourceConfig'
import App from '../App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: `/resource/${resourceTypes[0].id}`
    },
    {
      path: '/resource/:id',
      name: 'resource',
      component: App,
      props: true,
      meta: {
        getTitle: (id) => {
          const resource = resourceTypes.find(r => r.id === parseInt(id))
          return resource ? `${resource.name}配置` : '资源位配置'
        }
      }
    }
  ]
})

// 添加路由守卫来更新页面标题
router.beforeEach((to, from, next) => {
  if (to.name === 'resource') {
    const title = to.meta.getTitle(to.params.id)
    document.title = title
  }
  
  // 验证资源位 ID
  if (to.name === 'resource') {
    const resourceId = parseInt(to.params.id)
    const resourceExists = resourceTypes.some(r => r.id === resourceId)
    if (!resourceExists) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
