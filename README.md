# GREEN API Dashboard (Test Task)

Готовый mini-dashboard на чистом HTML/CSS/JS для работы с методами GREEN API (WhatsApp API):

- `getSettings`
- `getStateInstance`
- `sendMessage`
- `sendFileByUrl`

## Структура проекта

- `index.html` - разметка интерфейса
- `style.css` - стили mini-dashboard
- `script.js` - логика работы с API через `fetch`

## Что реализовано

- Поля ввода:
  - `idInstance`
  - `apiTokenInstance`
  - `phone`
  - `message`
  - `fileUrl`
- Кнопки для каждого метода GREEN API
- `textarea readonly` для красивого JSON-ответа
- Корректное формирование URL:
  - `https://api.green-api.com/waInstance{idInstance}/METHOD/{apiTokenInstance}`
- Обработка ошибок:
  - валидация обязательных полей
  - обработка HTTP-ошибок
  - обработка сетевых ошибок и не-JSON ответов
- Кнопка автозаполнения тестовыми данными

## Пример тестовых данных

Можно использовать кнопку **"Заполнить тестовыми данными"** или ввести вручную:

- `idInstance`: `1101000000`
- `apiTokenInstance`: `your_api_token_instance_here`
- `phone`: `79991234567`
- `message`: `Привет! Тест отправки из GREEN API dashboard.`
- `fileUrl`: `https://example-files.online-convert.com/document/txt/example.txt`

> Важно: для реальных запросов укажите действительные `idInstance` и `apiTokenInstance` из вашего кабинета GREEN API.

## Как запустить локально

### Вариант 1 (самый простой)
1. Откройте файл `index.html` в браузере.

### Вариант 2 (через локальный сервер)
Если установлен Node.js:
1. Откройте терминал в папке проекта.
2. Запустите:
   - `npx serve .`
3. Откройте адрес из терминала (обычно `http://localhost:3000`).

## Как пользоваться

1. Введите `idInstance` и `apiTokenInstance`.
2. Для `sendMessage` и `sendFileByUrl` заполните `phone`.
3. Для `sendMessage` заполните `message`.
4. Для `sendFileByUrl` заполните `fileUrl` (и при желании `message` как подпись).
5. Нажмите нужную кнопку метода.
6. Смотрите ответ API в блоке "Ответ API".

## Деплой на GitHub Pages

1. Создайте новый репозиторий на GitHub.
2. Загрузите в него файлы:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. Запушьте в ветку `main`.
4. В репозитории откройте `Settings` -> `Pages`.
5. В разделе **Build and deployment**:
   - `Source`: **Deploy from a branch**
   - `Branch`: **main** / **(root)**
6. Нажмите **Save** и подождите 1-2 минуты.
7. Ссылка на сайт появится в разделе GitHub Pages.

## Примечания по безопасности

- Не публикуйте рабочий `apiTokenInstance` в публичных репозиториях.
- Для production лучше хранить токен на backend, а не в клиентском коде.
