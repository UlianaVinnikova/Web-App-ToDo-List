import { mount } from '@vue/test-utils'
import About from '@/components/About.vue' 
import { createRouter, createMemoryHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' }
]

describe('About.vue', () => {
  let router
  let wrapper

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes
    })

    wrapper = mount(About, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
  })

  it('відображає правильний заголовок і кнопки', () => {
    expect(wrapper.find('h1').text()).toBe('TaskMaster')

    const buttons = wrapper.findAll('button.btn')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Увійти')
    expect(buttons[1].text()).toBe('Зареєструватися')
  })

  it('натискання кнопки "Увійти" переходить на /login', async () => {
    const loginBtn = wrapper.find('button.btn:nth-of-type(1)')
    await loginBtn.trigger('click')

    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('натискання кнопки "Зареєструватися" переходить на /register', async () => {
    const registerBtn = wrapper.find('button.btn:nth-of-type(2)')
    await registerBtn.trigger('click')

    expect(router.currentRoute.value.path).toBe('/register')
  })
})
