<template>
  <div class="page-wrapper">
    <div class="action-buttons">
      <button class="btn-action" @click="goToMain">Список справ</button>
      <button class="btn-action" @click="logout">Вийти</button>
    </div>

    <div class="profile-container">
      <h2>Профіль</h2>
      <table class="profile-table">
        <tbody>
          <tr>
            <th>Ім’я:</th>
            <td>{{ userData.name }}</td>
          </tr>
          <tr>
            <th>Прізвище:</th>
            <td>{{ userData.surname }}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{{ userData.email }}</td>
          </tr>
          <tr>
            <th>Стать:</th>
            <td>{{ genderText }}</td>
          </tr>
          <tr>
            <th>Дата народження:</th>
            <td>{{ formattedDob }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import axios from 'axios'

export default {
  data() {
    return {
      userData: {
        name: '',
        surname: '',
        email: '',
        gender: '',
        dob: ''
      }
    }
  },
  computed: {
    genderText() {
      switch (this.userData.gender) {
        case 'M': return 'Чоловіча'
        case 'F': return 'Жіноча'
        case 'A': return 'Інша'
        default: return ''
      }
    },
    formattedDob() {
      return this.userData.dob ? new Date(this.userData.dob).toLocaleDateString('uk-UA') : ''
    }
  },
  mounted() {
    this.fetchUserData()
  },
  methods: {
    async fetchUserData() {
    try {
      // Прокоментуй перевірку токена і userId на час тесту
      // const token = localStorage.getItem('token');
      // const userId = localStorage.getItem('user_id');
      // if (!token || !userId) {
      //   router.push('/login');
      //   return;
      // }

      // Тимчасово задаємо userId і токен фіксовані, або не робимо запит
      this.userData = {
        name: 'Тестове ім’я',
        surname: 'Тестове прізвище',
        email: 'test@example.com',
        gender: 'M',
        dob: '1990-01-01',
      };
    } catch (error) {
      console.error(error);
      Swal.fire('Помилка', 'Не вдалося завантажити дані користувача.', 'error');
    } finally {
      this.loading = false;
    }
  },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
      router.push('/about')
    },
    goToMain() {
      router.push('/todo')
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.action-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.btn-action {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-action:hover {
  background-color: #333;
}

.profile-container {
  max-width: 500px;
  margin: 100px auto 40px;
  padding: 20px;
  background-color: transparent;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
}

.profile-table {
  width: 100%;
  border-collapse: collapse;
}

.profile-table th,
.profile-table td {
  padding: 12px;
  border-bottom: 1px solid #000;
  text-align: left;
}

.profile-table th {
  width: 40%;
  font-weight: 600;
}
</style>
