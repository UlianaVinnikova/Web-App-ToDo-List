describe('To-Do App Navigation and Functionality', () => {
  const baseUrl = 'http://localhost:5173';

  it('Відкриває сторінку "Про додаток"', () => {
    cy.visit(`${baseUrl}/about`);
    cy.contains('TaskMaster'); 
  });

  it('Відкриває сторінку "Аутентифікація(Вхід)"', () => {
    cy.visit(`${baseUrl}/login`);
    cy.contains('Вхід'); 
  });

  it('Відкриває сторінку "Реєстрація"', () => {
    cy.visit(`${baseUrl}/register`);
    cy.contains('Реєстрація'); 
  });

  it('Відкриває сторінку "Профіль"', () => {
    cy.visit(`${baseUrl}/profile`);
    cy.contains('Профіль'); 
  });

  it('Відкриває сторінку "Список справ"', () => {
    cy.visit(`${baseUrl}/todo`);
    cy.contains('Список справ'); 
  });

  it('Перехід на сторінку "Список справ" з сторінки "Профіль"', () => {
    cy.visit(`${baseUrl}/profile`);
    cy.contains('button', 'Список справ').click();
    cy.url().should('include', '/todo');
  });

  it('Перехід на сторінку "Профіль" з сторінки "Список справ"', () => {
    cy.visit(`${baseUrl}/todo`);
    cy.contains('button', 'Профіль').click();
    cy.url().should('include', '/profile');
  });

  it('Перехід на сторінку "Про додаток" з сторінки "Список справ"', () => {
    cy.visit(`${baseUrl}/todo`);
    cy.contains('button', 'Вийти').click();
    cy.url().should('include', '/about');
  });
 
  it('Перехід на сторінку "Про додаток" з сторінки "Профіль"', () => {
    cy.visit(`${baseUrl}/profile`);
    cy.contains('button', 'Вийти').click();
    cy.url().should('include', '/about');
  });

  it('Перехід на сторінку "Про додаток" з сторінки "Логін"', () => {
    cy.visit(`${baseUrl}/login`);
    cy.contains('button', '← Повернутися назад').click();
    cy.url().should('include', '/about');
  });

  it('Перехід на сторінку "Про додаток" з сторінки "Реєстрація"', () => {
    cy.visit(`${baseUrl}/register`);
    cy.contains('button', '← Повернутися назад').click();
    cy.url().should('include', '/about');
  });

  it('Додає нову справу в To-Do List', () => {
    cy.visit(`${baseUrl}/todo`);
    cy.get('[data-cy="title-input"]').type('Нова справа');
    cy.get('[data-cy="description-input"]').type('Опис задачі');
    cy.get('[data-cy="date-input"]').type('2025-06-09');
    cy.get('[data-cy="add-task-btn"]').click();
  });

  it('Видаляє одну справу через чекбокс і кнопку "Видалити обрані"', () => {
    cy.visit(`${baseUrl}/todo`);
    cy.get('[data-cy="title-input"]').type('Тестова справа');
    cy.get('[data-cy="description-input"]').type('Це справа для видалення');
    cy.get('[data-cy="date-input"]').type(new Date().toISOString().substr(0, 10));
    cy.get('[data-cy="add-task-btn"]').click();

    cy.contains('[data-cy="task-title"]', 'Тестова справа').should('exist');

    cy.get('[data-cy="task-checkbox"]').last().check({ force: true });

    cy.get('[data-cy="delete-selected-btn"]').click();

    cy.contains('[data-cy="task-title"]', 'Тестова справа').should('not.exist');
  });
  
  it('Редагує справу в списку справ на сторінці "Список справ"', () => {
    cy.visit(`${baseUrl}/todo`);
    cy.get('[data-cy="task-row"]').first().click();

    cy.get('[data-cy="edit-modal"]').should('be.visible');

    cy.get('[data-cy="edit-title-input"]')
      .clear()
      .type('Змінена назва');

    cy.get('[data-cy="edit-description-input"]')
      .clear()
      .type('Змінений опис');

    const today = new Date().toISOString().substr(0, 10);
    cy.get('[data-cy="edit-date-input"]').clear().type(today);

    cy.get('[data-cy="save-task-btn"]').click();

    cy.get('[data-cy="edit-modal"]').should('not.exist');

    cy.get('[data-cy="task-row"]').first().within(() => {
      cy.get('[data-cy="task-title"]').should('have.text', 'Змінена назва');
      cy.get('[data-cy="task-description"]').should('have.text', 'Змінений опис');
      cy.get('[data-cy="task-date"]').should('have.text', today);
    });
  });

  it('Кнопка "Видалити обрані" неактивна, якщо ні одна справа не обрана', () => {
    cy.visit(`${baseUrl}/todo`);
 
    cy.get('[data-cy=delete-selected-btn]').should('be.disabled')

    cy.get('[data-cy=task-checkbox]').first().check()

    cy.get('[data-cy=delete-selected-btn]').should('not.be.disabled')

    cy.get('[data-cy=task-checkbox]').first().uncheck()

    cy.get('[data-cy=delete-selected-btn]').should('be.disabled')
  })

  it('Після додавання нової справи поля введення даних очищуються', () => {
    cy.visit(`${baseUrl}/todo`);

    const title = 'Нова справа'
    const description = 'Опис нової справи'
    const date = '2025-06-09'

    cy.get('[data-cy=title-input]').type(title)
    cy.get('[data-cy=description-input]').type(description)
    cy.get('[data-cy=date-input]').type(date)

    cy.get('[data-cy=add-task-btn]').click()

    cy.get('[data-cy=title-input]').should('have.value', '')
    cy.get('[data-cy=description-input]').should('have.value', '')
    cy.get('[data-cy=date-input]').should('have.value', '')
  })

  it('Успішно заповнює форму Реєстрації', () => {
    cy.visit(`${baseUrl}/register`);
    cy.get('input#name').type('Іван');
    cy.get('input#surname').type('Петренко');
    cy.get('input#email').type(`test_petrenko@example.com`);
    cy.get('input#password').type('password123');
    cy.get('select#gender').select('Чоловіча');
    cy.get('input#dob').type('1990-01-01');
    cy.get('button[type="submit"]').click();
  });

  it('Виконує Аутентифікацію/Логін', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
  });

});