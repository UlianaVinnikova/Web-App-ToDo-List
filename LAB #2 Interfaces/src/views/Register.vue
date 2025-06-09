<template>
  <div class="page-wrapper">
    <button class="back-button" @click="goBack">← Повернутися назад</button>

    <div class="register-container">
      <h2>Реєстрація</h2>
      <form @submit.prevent="submitForm" class="register-form">
        <div class="form-group">
          <label for="name">Ім’я:</label>
          <input type="text" id="name" v-model="formData.name" required placeholder="Введіть ім’я" />
        </div>

        <div class="form-group">
          <label for="surname">Прізвище:</label>
          <input type="text" id="surname" v-model="formData.surname" required placeholder="Введіть прізвище" />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="formData.email" required placeholder="Введіть email" />
        </div>

        <div class="form-group">
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="formData.password" required placeholder="Введіть пароль" />
        </div>

        <div class="form-group">
          <label for="gender">Стать:</label>
          <select id="gender" v-model="formData.gender" required>
            <option disabled value="">Оберіть стать</option>
            <option>Чоловіча</option>
            <option>Жіноча</option>
            <option>Інша</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dob">Дата народження:</label>
          <input type="date" id="dob" v-model="formData.dob" required />
        </div>

        <button type="submit" class="btn-submit">Зареєструватися</button>
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
      formData: {
        name: '',
        surname: '',
        email: '',
        password: '',
        gender: '',
        dob: ''
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/register/', this.formData)
        localStorage.setItem('token', response.data.token)
        router.push('/')
      } catch (error) {
        console.error('Registration error:', error)
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

.register-container {
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

.register-form {
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

input,
select {
  width: 100%;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1.5px solid #000;
  border-radius: 4px;
  background: #fff;
  color: #000;
  box-sizing: border-box;
}

input:focus,
select:focus {
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
