import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import Login from '@/components/Login.vue'
import axios from 'axios'
import router from '@/router'

jest.mock('axios')
jest.mock('@/router', () => ({
  push: jest.fn()
}))

beforeAll(() => {
  Storage.prototype.setItem = jest.fn()
})

describe('Login.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('рендерить поля email, пароль і кнопку', () => {
    render(Login)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /увійти/i })).toBeInTheDocument()
  })

  test('користувач може вводити email і пароль', async () => {
    render(Login)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)

    await fireEvent.update(emailInput, 'test@example.com')
    await fireEvent.update(passwordInput, 'password123')

    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  test('успішний логін зберігає токен, виконує запити і редіректить', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'test-token', id: 123 }
    })
    axios.get
      .mockResolvedValueOnce({ data: ['accomodation1', 'accomodation2'] })
      .mockResolvedValueOnce({ data: ['transport1', 'transport2'] })

    render(Login)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const submitButton = screen.getByRole('button', { name: /увійти/i })

    await fireEvent.update(emailInput, 'user@example.com')
    await fireEvent.update(passwordInput, 'mypassword')
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token')
      expect(localStorage.setItem).toHaveBeenCalledWith('user_id', 123)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'accomodations',
        JSON.stringify(['accomodation1', 'accomodation2'])
      )
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'transports',
        JSON.stringify(['transport1', 'transport2'])
      )
      expect(router.push).toHaveBeenCalledWith('/main')
    })
  })

  test('кнопка "Повернутися назад" виконує перехід на /about', async () => {
    render(Login)
    const backButton = screen.getByText(/← повернутися назад/i)

    await fireEvent.click(backButton)
    expect(router.push).toHaveBeenCalledWith('/about')
  })

  test('обробляє помилку при неуспішному логіні', async () => {
    const error = new Error('Network Error')
    axios.post.mockRejectedValue(error)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(Login)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/пароль/i)
    const submitButton = screen.getByRole('button', { name: /увійти/i })

    await fireEvent.update(emailInput, 'baduser@example.com')
    await fireEvent.update(passwordInput, 'badpassword')
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error during login:', error)
    })

    consoleSpy.mockRestore()
  })
})
