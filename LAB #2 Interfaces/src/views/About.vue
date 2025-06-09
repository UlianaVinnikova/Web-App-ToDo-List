<template>
  <div class="about-container">
    <header class="header">
      <div class="header-content">
        <h1>TaskMaster</h1>
        <img :src="logo" alt="TaskMaster Logo" class="logo" />
      </div>
      <p class="subtitle">Простий та зручний додаток для планування та контролю ваших завдань</p>
    </header>
    <section class="description">
      <p>
        <strong>TaskMaster</strong> — ваш надійний помічник в організації повсякденних справ.
        Завдяки інтуїтивному інтерфейсу ви легко додаєте нові завдання, ставите пріоритети та слідкуєте за прогресом.
      </p>
      <p>
        Організуйте свій день ефективно — плануйте, делегуйте, відмічайте виконані справи.
        TaskMaster допомагає фокусуватись на найважливішому, щоб ви досягали цілей швидше та без стресу.
      </p>
      <p>
        Вбудований список справ дозволяє вам управляти завданнями будь-де і будь-коли — на роботі, вдома або в дорозі.
        Більше ніяких забутих справ та нескінченного хаосу — тільки ясність і порядок.
      </p>
    </section>

    <div class="auth-buttons">
      <button @click="goToLogin" class="btn">Увійти</button>
      <button @click="goToRegister" class="btn">Зареєструватися</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/taskmaster-logo.png'

const router = useRouter()

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.about-container {
  max-width: 720px;
  margin: 60px auto;
  padding: 30px 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  font-family: 'Open Sans', sans-serif;
  color: #000;
}

.header {
  margin-bottom: 35px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

h1 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 3.2rem;
  color: #000;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.logo {
  width: 100px;
  height: auto;
  flex-shrink: 0;
  margin-left: 15px;
}

.subtitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  font-style: italic;
  margin-top: 10px;
  text-align: center;
  letter-spacing: 0.5px;
}

.description p {
  font-size: 1.15rem;
  line-height: 1.7;
  margin-bottom: 22px;
  text-align: justify;
  max-width: 100%;
  color: #000;
}

.description p strong {
  font-weight: 700;
}

.auth-buttons {
  display: flex;
  justify-content: center; 
  gap: 20px;
  margin-top: 40px;
}

.btn {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #333;
}

@media (max-width: 480px) {
  .about-container {
    padding: 20px 25px;
    margin: 40px 20px;
  }
  h1 {
    font-size: 2.4rem;
  }
  .subtitle {
    font-size: 1.1rem;
  }
  .description p {
    font-size: 1rem;
    margin-bottom: 18px;
  }
  .header-content {
    flex-direction: column;
  }
  .logo {
    margin-left: 0;
    margin-top: 15px;
    width: 80px;
  }
  .auth-buttons {
    margin-top: 30px;
    gap: 15px;
    flex-direction: column;
    align-items: center;
  }
  .btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>
