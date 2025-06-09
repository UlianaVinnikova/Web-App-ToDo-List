import { mount } from '@vue/test-utils'
import TodoList from '@/components/ToDoList.vue'  

describe('TodoList', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TodoList, {
      mocks: {
        $router: {
          push: jest.fn(),
        },
      },
    })
  })

  it('відображає початкові завдання', () => {
    expect(wrapper.text()).toContain('Прочитати книгу')
    expect(wrapper.text()).toContain('Тренування')
  })

  it('додає нове завдання', async () => {
    await wrapper.find('[data-cy=title-input]').setValue('Нове завдання')
    await wrapper.find('[data-cy=description-input]').setValue('Опис нового завдання')
    await wrapper.find('[data-cy=date-input]').setValue('2025-06-10')
    await wrapper.find('[data-cy=add-task-btn]').trigger('click')

    expect(wrapper.text()).toContain('Нове завдання')
  })

  it('фільтрує завдання за датою', async () => {
    const date = wrapper.vm.tasks[0].date
    await wrapper.find('[data-cy=filter-date-input]').setValue(date)

    const filteredTasks = wrapper.vm.filteredTasks
    filteredTasks.forEach(task => {
      expect(task.date).toBe(date)
    })
  })

  it('відкриває та закриває модальне вікно редагування', async () => {
    await wrapper.find('[data-cy=task-row]').trigger('click')
    expect(wrapper.find('[data-cy=edit-modal]').exists()).toBe(true)

    await wrapper.find('[data-cy=cancel-edit-btn]').trigger('click')
    expect(wrapper.find('[data-cy=edit-modal]').exists()).toBe(false)
  })

  it('редагує завдання', async () => {
    await wrapper.find('[data-cy=task-row]').trigger('click')
    const editTitleInput = wrapper.find('[data-cy=edit-title-input]')
    await editTitleInput.setValue('Змінена назва')
    await wrapper.find('[data-cy=save-task-btn]').trigger('click')

    expect(wrapper.text()).toContain('Змінена назва')
  })

  it('видаляє вибране завдання', async () => {
    const firstCheckbox = wrapper.find('[data-cy=task-checkbox]')
    await firstCheckbox.setChecked(true)
    await wrapper.find('[data-cy=delete-selected-btn]').trigger('click')

    expect(wrapper.vm.tasks.length).toBe(1)
  })

  it('кнопка Профіль переходить на /profile', async () => {
    await wrapper.find('[data-cy=profile-btn]').trigger('click')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/profile')
  })

  it('кнопка Вийти очищує localStorage і переходить на /about', async () => {
    localStorage.setItem('token', '123')
    localStorage.setItem('user_id', '321')

    await wrapper.find('[data-cy=logout-btn]').trigger('click')

    expect(localStorage.getItem('token')).toBe(null)
    expect(localStorage.getItem('user_id')).toBe(null)
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/about')
  })
})
