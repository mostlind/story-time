import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import Story from '@/components/Story'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/story/:id',
      name: 'Story',
      component: Story,
      props: true
    },
    {
      path: '/story/:id/create',
      name: 'CreateChapter',
      component: Story,
      props: {
        default: true,
        create: true
      }
    },
    {
      path: '/',
      name: 'Hello',
      component: Story
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignUp
    }
  ]
})
