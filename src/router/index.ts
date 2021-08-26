import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "@/views/home.vue";
import UserLogin from "@/views/user/login.vue";
import UserCreate from "@/views/user/create.vue";

import Panic from '@/views/panic.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/user/login",
    name: "UserLogin",
    component: UserLogin,
  },
  {
    path: "/user/create",
    name: "UserCreate",
    component: UserCreate,
  },
  {
    path: "/panic",
    name: "Panic",
    component: Panic,
    props: true,
    beforeEnter: (to, from, next) => {
      if(!to.params.error) {
        next("/");
        return;
      }
      next();
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
