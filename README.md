## Инструкция по запуску сервера:

1. git clone https://github.com/AndreiZaretski/server-final-tas.git
2. npm i
3. Для запуска сервера локально на windows необходимо удалить модуль npm uninstall argon2 --target_arch=x64 --target_platform=linux --target_libc=glibc
4. Установить install argon2 без флагов
5. npm start
6. Если что то пошло не так обращайтесь к разработчику данного продукта)


## Примеры запросов на постман

В body используется формат данных JSON

## Регистрация:

method POST

url https://ava-editor-server-final-task-production.up.railway.app/auth/registration

req body {
"username":"123",
"userEmail": "123@m.ru",
"password":"1234"
}

 

![Image alt](https://github.com/AndreiZaretski/server-final-tas/raw/master/src/registration.png)


## Логин:

method POST

url https://ava-editor-server-final-task-production.up.railway.app/auth/login

req body {
"username":"An",
"userEmail": "And",
"password":"1234"
} *

*Ввести два раза или имя или почту

![Image alt](https://github.com/AndreiZaretski/server-final-tas/raw/master/src/login.png)

## Удаление, смена имени, почты, пароля, стать премиум

Method DELETE - для удаления,
PUT для смены данных

https://ava-editor-server-final-task-production.up.railway.app/auth/delete

req body {
  "password": ""
  }

https://ava-editor-server-final-task-production.up.railway.app/auth/updateusername

req body {
    "username": ""
}

https://ava-editor-server-final-task-production.up.railway.app/auth/updateuseremail

req body {
    "userEmail": ""
}

https://ava-editor-server-final-task-production.up.railway.app/auth/updaterole

req body  {
    "key": ""
}

правильный ключ RSSchool

https://ava-editor-server-final-task-production.up.railway.app/auth/updatepassword

req body {
"userEmail":"vala@mail.ru",
"password":"12345"
}

Во всех запросах нужно ввсести в заголовке токен:

headers Authorization   bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmM4MmIwYTgwYTRkYzM5M2JlMWE2MiIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjc3NDk0MDg0LCJleHAiOjE2Nzc1ODA0ODR9.kvwjqC98PJFMIyxNqWcsmXkzCwUSqDoibjo3_5ri6J4

![Image alt](https://github.com/AndreiZaretski/server-final-tas/raw/master/src/delete.png)