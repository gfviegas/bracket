import Vue from 'vue'
import Router from 'vue-router'

import Brackets from '@/components/Brackets'
import Bracket from '@/components/Bracket'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Brackets',
      component: Brackets
    },
    {
      path: '/:slug',
      name: 'Bracket',
      component: Bracket
    }
  ]
})
