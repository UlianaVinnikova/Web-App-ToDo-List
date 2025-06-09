import { mount } from '@vue/test-utils'
import RegisterForm from '@/components/Register.vue'
import axios from 'axios'
import router from '@/router'

jest.mock('axios')

jest.mock('@/router', () => ({
  push: jest.fn()
}))

describe('RegisterForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(RegisterForm)
    jest.clearAllMocks()
  })

  it('виконує реєстрацію з валідними даними та переходить на /', async () => {
    
    await wrapper.find('#name').setValue('Іван')
    await wrapper.find('#surname').setValue('Іванов')
    await wrapper.find('#email').setValue('ivan@example.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper.find('#gender').setValue('Чоловіча')
    await wrapper.find('#dob').setValue('1990-01-01')

    axios.post.mockResolvedValue({
      data: { token: 'fake-token' }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:5173/register/', {
      name: 'Іван',
      surname: 'Іванов',
      email: 'ivan@example.com',
      password: 'password123',
      gender: 'Чоловіча',
      dob: '1990-01-01'
    })

    expect(localStorage.getItem('token')).toBe('fake-token')


    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('переходить назад при кліку на кнопку "Повернутися назад"', async () => {
    await wrapper.find('.back-button').trigger('click')
    expect(router.push).toHaveBeenCalledWith('/about')
  })

  it('показує помилку у консолі при помилці реєстрації', async () => {
    console.error = jest.fn()

    axios.post.mockRejectedValue(new Error('Network Error'))

    await wrapper.find('#name').setValue('Іван')
    await wrapper.find('#surname').setValue('Іванов')
    await wrapper.find('#email').setValue('ivan@example.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper.find('#gender').setValue('Чоловіча')
    await wrapper.find('#dob').setValue('1990-01-01')

    await wrapper.find('form').trigger('submit.prevent')

    expect(console.error).toHaveBeenCalledWith(
      'Registration error:',
      expect.any(Error)
    )
  })
})
