import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

// user
import CreateUser from "../views/user/Create.vue";

// lesson
import ViewLesson from "../views/lesson/View.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/user/create",
    name: "CreateUser",
    component: CreateUser,
  },

  {
    path: "/lesson/view",
    name: "ViewLesson",
    component: ViewLesson,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
