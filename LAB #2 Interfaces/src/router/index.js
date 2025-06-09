import { createRouter, createWebHistory } from 'vue-router'
import About from '../views/About.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import ToDoList from '../views/ToDoList.vue'

const routes = [
  { path: '/about', name: 'About', component: About },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/todo', name: 'ToDoList', component: ToDoList },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
