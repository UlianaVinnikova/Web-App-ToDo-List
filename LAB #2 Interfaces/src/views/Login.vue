<template>
  <div class="page-wrapper">
    <button class="back-button" @click="goBack">← Повернутися назад</button>

    <div class="login-container">
      <h2>Вхід</h2>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required placeholder="Введіть email" />
        </div>

        <div class="form-group">
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="password" required placeholder="Введіть пароль" />
        </div>

        <button type="submit" class="btn-submit">Увійти</button>
      </form>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/login/', {
          email: this.email,
          password: this.password
        })
        localStorage.setItem('token', response.data['token'])
        localStorage.setItem('user_id', response.data['id'])

        const config = {
          headers: {
            'Authorization': 'Token ' + response.data['token'],
            'Content-Type': 'application/json'
          }
        }

        const request1 = await axios.get('http://127.0.0.1:8000/api/accomodations/', config)
        localStorage.setItem('accomodations', JSON.stringify(request1.data))

        const request2 = await axios.get('http://127.0.0.1:8000/api/transports/', config)
        localStorage.setItem('transports', JSON.stringify(request2.data))

        router.push('/main')
      } catch (error) {
        console.error('Error during login:', error)
      }
    },
    goBack() {
      router.push('/about')
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: #fff;
  color: #000;
}

.back-button {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: bold;
  z-index: 1000;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #333;
}

.login-container {
  max-width: 450px;
  margin: 80px auto;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 28px;
  color: #000;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #000;
}

input {
  width: 100%;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1.5px solid #000;
  border-radius: 4px;
  background: #fff;
  color: #000;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}

.btn-submit {
  background-color: #000;
  color: #fff;
  font-weight: 700;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-submit:hover {
  opacity: 0.8;
}
</style>
