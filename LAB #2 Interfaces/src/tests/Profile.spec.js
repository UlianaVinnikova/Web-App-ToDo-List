import { mount } from '@vue/test-utils'
import Profile from '@/components/Profile.vue' 
import { createRouter, createMemoryHistory } from 'vue-router'

const routes = [
  { path: '/about', name: 'About' },
  { path: '/todo', name: 'Todo' }
]

describe('Profile.vue', () => {
  let router
  let wrapper

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes
    })

    wrapper = mount(Profile, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
  })

  it('коректно відображає дані користувача', () => {
    expect(wrapper.text()).toContain('Тестове ім’я')
    expect(wrapper.text()).toContain('Тестове прізвище')
    expect(wrapper.text()).toContain('test@example.com')
    expect(wrapper.text()).toContain('Чоловіча')
    expect(wrapper.text()).toContain('01.01.1990') 

  it('кнопка "Список справ" веде на /todo', async () => {
    const btn = wrapper.find('button.btn-action:first-of-type')
    await btn.trigger('click')
    expect(router.currentRoute.value.path).toBe('/todo')
  })

  it('кнопка "Вийти" очищує localStorage і веде на /about', async () => {
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('user_id', '123')

    const btn = wrapper.find('button.btn-action:last-of-type')
    await btn.trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user_id')).toBeNull()
    expect(router.currentRoute.value.path).toBe('/about')
  })
})
