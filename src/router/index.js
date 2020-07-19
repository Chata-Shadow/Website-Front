import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import wallmanage from '@/components/wallmanage'
import notfound from '@/components/notfound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/wallmanage',
          name: 'wallmanage',
          component: wallmanage
        },
        {
          path: '/notfound',
          name: 'notfound',
          component: notfound
        },
        
      ]
    },
  ],
  
})
