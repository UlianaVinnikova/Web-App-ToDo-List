<template>
  <div class="todo-wrapper">
    <div class="top-buttons">
      <button class="btn-action" @click="goToProfile" data-cy="profile-btn">Профіль</button>
      <button class="btn-action" @click="logout" data-cy="logout-btn">Вийти</button>
    </div>

    <div class="todo-header">
      <h2>Список справ</h2>
      <input
        type="date"
        v-model="selectedDate"
        class="date-picker"
        data-cy="filter-date-input"
      />
    </div>

    <table class="todo-table">
      <thead>
        <tr>
          <th>Обрати</th>
          <th>Назва</th>
          <th>Опис</th>
          <th>Дата виконання</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(task, index) in filteredTasks"
          :key="index"
          @click="openEditModal(index)"
          data-cy="task-row"
        >
          <td @click.stop>
            <input
              type="checkbox"
              v-model="selectedTasks"
              :value="index"
              data-cy="task-checkbox"
            />
          </td>
          <td data-cy="task-title">{{ task.title }}</td>
          <td data-cy="task-description">{{ task.description }}</td>
          <td data-cy="task-date">{{ task.date }}</td>
        </tr>
      </tbody>
    </table>

    <div class="form-container">
      <input
        v-model="newTask.title"
        placeholder="Назва"
        data-cy="title-input"
      />
      <input
        v-model="newTask.description"
        placeholder="Опис"
        data-cy="description-input"
      />
      <input
        type="date"
        v-model="newTask.date"
        data-cy="date-input"
      />
      <button
        class="btn-add"
        @click="addTask"
        data-cy="add-task-btn"
      >Додати справу</button>
      <button
        class="btn-delete"
        @click="deleteSelectedTasks"
        :disabled="selectedTasks.length === 0"
        data-cy="delete-selected-btn"
      >Видалити обрані</button>
    </div>

    <!-- Модальне вікно -->
    <div v-if="editingIndex !== null" class="modal-overlay" data-cy="edit-modal">
      <div class="modal">
        <h3>Редагувати справу</h3>
        <input
          v-model="editTask.title"
          placeholder="Назва"
          data-cy="edit-title-input"
        />
        <input
          v-model="editTask.description"
          placeholder="Опис"
          data-cy="edit-description-input"
        />
        <input
          type="date"
          v-model="editTask.date"
          data-cy="edit-date-input"
        />
        <div class="modal-buttons">
          <button
            class="btn-save"
            @click="saveTask"
            data-cy="save-task-btn"
          >Зберегти</button>
          <button
            class="btn-delete"
            @click="deleteTask"
            data-cy="delete-task-btn"
          >Видалити</button>
          <button
            class="btn-cancel"
            @click="closeModal"
            data-cy="cancel-edit-btn"
          >Скасувати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: new Date().toISOString().substr(0, 10),
      newTask: { title: '', description: '', date: '' },
      editTask: { title: '', description: '', date: '' },
      editingIndex: null,
      selectedTasks: [],
      tasks: [
        {
          title: 'Прочитати книгу',
          description: 'Прочитати 20 сторінок',
          date: new Date().toISOString().substr(0, 10),
        },
        {
          title: 'Тренування',
          description: 'Кардіо 30 хв',
          date: new Date().toISOString().substr(0, 10),
        },
      ],
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter((task) => task.date === this.selectedDate);
    },
  },
  methods: {
    goToProfile() {
      this.$router.push('/profile');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      this.$router.push('/about');
    },
    addTask() {
      if (this.newTask.title && this.newTask.description && this.newTask.date) {
        this.tasks.push({ ...this.newTask });
        this.newTask = { title: '', description: '', date: '' };
      }
    },
    deleteSelectedTasks() {
      this.tasks = this.tasks.filter(
        (_, index) => !this.selectedTasks.includes(index)
      );
      this.selectedTasks = [];
    },
    openEditModal(index) {
      this.editingIndex = index;
      this.editTask = { ...this.tasks[index] };
    },
    saveTask() {
      if (this.editingIndex !== null) {
        this.tasks[this.editingIndex] = { ...this.editTask };
        this.closeModal();
      }
    },
    deleteTask() {
      if (this.editingIndex !== null) {
        this.tasks.splice(this.editingIndex, 1);
        this.closeModal();
      }
    },
    closeModal() {
      this.editingIndex = null;
    },
  },
};
</script>

<style scoped>
.todo-wrapper {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.top-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.btn-action {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: bold;
}

.btn-action:hover {
  background-color: #333;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-picker {
  padding: 8px;
  border: 1.5px solid #000;
  border-radius: 4px;
}

.todo-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.todo-table th,
.todo-table td {
  border: 1.5px solid #000;
  padding: 10px;
  text-align: left;
}

.form-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.form-container input {
  flex: 1;
  padding: 10px;
  border: 1.5px solid #000;
  border-radius: 4px;
}

.btn-add,
.btn-delete,
.btn-save,
.btn-cancel {
  background-color: #000;
  color: #fff;
  padding: 10px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-add:hover,
.btn-delete:hover,
.btn-save:hover,
.btn-cancel:hover {
  opacity: 0.85;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

.modal input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1.5px solid #000;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
