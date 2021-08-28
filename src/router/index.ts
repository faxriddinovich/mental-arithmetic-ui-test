import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import store from '@/store';

import Home from "@/views/home.vue";
import UserLogin from "@/views/user/login.vue";
import UserCreate from "@/views/user/create.vue";

import ReportError from "@/views/report-error.vue";

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
    path: "/report-error",
    name: "report-error",
    component: ReportError,
    props: true,
    beforeEnter: (to, from, next) => {
      if(!store.state.runtimeError) {
        return next("/");
      }
      next({ query: { redirect: from.name } });
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
