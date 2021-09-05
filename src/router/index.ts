import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import store from "@/store";

import Home from "@/views/home.vue";
import UserLogin from "@/views/user/login.vue";

import MainResources from "@/views/main-resources.vue";
import OtherResources from "@/views/other-resources.vue";

import EnterProfile from "@/views/user/enter-profile.vue";

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
    path: "/user/enter-profile",
    name: "EnterProfile",
    component: EnterProfile,
  },
  /*
  {
    path: "/user/create",
    name: "UserCreate",
    component: UserCreate,
  },
  */
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
