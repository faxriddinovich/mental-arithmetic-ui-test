import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import store from "@/store";

import Home from "@/views/home.vue";

import MainResources from "@/views/main-resources.vue";
import OtherResources from "@/views/other-resources.vue";

import AuthenticateAccount from "@/views/account/authenticate.vue";

import Settings from "@/views/settings.vue";

import Course from "@/views/course/course.vue";

import AccountBlocked from '@/views/account/blocked.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      { path: "/", component: MainResources },
      { path: "/other-resources", component: OtherResources },
    ],
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/account/authenticate",
    name: "AuthenticateAccount",
    component: AuthenticateAccount,
  },
  {
    path: "/course/:id",
    name: "Course",
    component: Course,
  },
  {
    path: "/account/blocked",
    name: "Blocked",
    component: AccountBlocked
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
