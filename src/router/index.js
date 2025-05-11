import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import AllArticles from '../views/AllArticles.vue'
import NewArticle from '../views/NewArticle.vue'
import EditArticle from '../views/EditArticle.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  // صفحات بدون layout (مثلاً login/signup)
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },

  // صفحات با layout
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'AllArticles', component: AllArticles },
      { path: 'article/:slug/edit', name: 'EditArticle', component: EditArticle },
      { path: 'new-article', name: 'NewArticle', component: NewArticle },
    ]
  },

  // صفحه 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router