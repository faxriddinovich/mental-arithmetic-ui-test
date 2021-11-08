import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "ru",
  messages: {
    en: {
      "mental-arithmetic": "Mental arithmetic",
      "other-resources": "Other resources",

      filter: "Filter",
      price: "Price",
      popular: "Popular",
      purchased: "Purchased",
      search: "Search",
      "course-search-placeholder":
        "Please write the title of the course or the name of the author",
      "no-courses-found": "No courses found",
      "load-more": "Load more",

      account: {
        account: "Account",
        authenticate: "Authenticate",
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
      "course-search-placeholder":
        "Пожалуйста, напишите название курса или имя автора",
      "no-courses-found": "Курсов не найдено",
      "load-more": "Загрузить больше",

      account: {
        account: "Аккаунт",
        authenticate: "Аутентифицировать",
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
      "course-search-placeholder": "Iltimos kurs nomi yoki avtor ismini yozing",
      "no-courses-found": "Kurslar topilmadi",
      "load-more": "Ko'proq yuklash",

      account: {
        account: "Akkaunt",
      },
    },
  },
});

export default i18n;
