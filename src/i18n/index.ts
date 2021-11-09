import Vue from "vue";
import VueI18n from "vue-i18n";
import Store from "@/store";

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "en",
  messages: {
    en: {
      "mental-arithmetic": "Mental arithmetic",
      "other-resources": "Other resources",

      filter: "Filter",
      price: "Price",
      popular: "Popular",
      purchased: "Purchased",
      search: "Search",
      home: "Home",
      "course-search-placeholder":
        "Please write the title of the course or the name of the author",
      "no-courses-found": "No courses found",
      "load-more": "Load more",
      "authenticate-username-input-placeholder": "Please write your username",
      "authenticate-email-input-placeholder": "Please write your email address",
      "authenticate-password-input-placeholder": "Please write password",
      "success-authentication": "Welcome {username}!",
      "invalid-credentials": "Invalid credentials",

      "latest-event": "Show latest event",
      "will-be-shown": "Will be shown",
      "will-be-hidden": "Will be hidden",
      language: "Language",
      "save-changes": "Save changes",
      "changes-applied": "Changes applied",

      account: {
        account: "Account",
        authenticate: "Authenticate",
        username: "Username",
        password: "Password",
        email: "Email address",
        create: "Create an account",
      },
    },
    ru: {
      "mental-arithmetic": "Ментальная арифметика",
      "other-resources": "Другие ресурсы",
      filter: "Фильтр",
      price: "Цена",
      popular: "Популярно",
      purchased: "Куплен",
      search: "Искать",
      home: "Домой",
      "course-search-placeholder":
        "Пожалуйста, напишите название курса или имя автора",
      "no-courses-found": "Курсов не найдено",
      "load-more": "Загрузить больше",
      "authenticate-username-input-placeholder":
        "Пожалуйста, напишите ваше имя пользователя",
      "authenticate-email-input-placeholder":
        "Пожалуйста, напишите свою электронную почту",
      "authenticate-password-input-placeholder": "Пожалуйста, напишите пароль",
      "success-authentication": "Добро пожаловать {username}!",
      "invalid-credentials": "Неверные учетные данные",
      "latest-event": "Показать последнее событие",
      "will-be-shown": "Будет показано",
      "will-be-hidden": "Будет скрыто",
      language: "Язык",
      "save-changes": "Сохранить изменения",
      "changes-applied": "Изменения внесены",

      account: {
        account: "Аккаунт",
        authenticate: "Аутентифицировать",
        username: "Имя пользователя",
        password: "Пароль",
        email: "Email почта",
        create: "Создать аккаунт",
      },
    },
    uz: {
      "mental-arithmetic": "Mental arifmetika",
      "other-resources": "Boshqa resurslar",
      filter: "Filter",
      price: "Narx",
      popular: "Mashhur",
      purchased: "Sotib olingan",
      search: "Qidirish",
      home: "Uyga",
      "course-search-placeholder": "Iltimos kurs nomi yoki avtor ismini yozing",
      "no-courses-found": "Kurslar topilmadi",
      "load-more": "Ko'proq yuklash",

      "authenticate-username-input-placeholder":
        "Iltimos foydalanuvchi ismini yozing",
      "authenticate-email-input-placeholder":
        "Iltimos elektron pochta manzilingizni yozing",
      "authenticate-password-input-placeholder": "Iltimos parol yozing",
      "success-authentication": "Hush kelibsiz {username}!",
      "invalid-credentials": "Noto'g'ri akkaunt ma'lumotlari",
      "latest-event": "Ohirgi hodisani ko'rsatish",
      "will-be-shown": "Ko'rsatiladi",
      "will-be-hidden": "Ko'rsatilmaydi",
      language: "Til",
      "save-changes": "O'zgarishlarni saqlash",
      "changes-applied": "Oʻzgarishlar qoʻllanildi",

      account: {
        account: "Akkaunt",
        authenticate: "Auntefikatsiya",
        username: "Foydalanuvchi ismi",
        password: "Parol",
        email: "Email pochta",
        create: "Akkaunt yaratish",
      },
    },
  },
});

Store.dispatch("getSetting", "locale").then((setting) => {
  i18n.locale = setting.value;
});

export default i18n;
