import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Activation from "@/views/Activation.vue";
import Settings from '@/views/Settings.vue';
import FlashCard from '@/views/FlashCard.vue';

import UserLogin from '@/views/user/login.vue';
import UserAccount from '@/views/user/account.vue';

import Courses from '@/views/course/courses.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/activation",
    name: "Activation",
    component: Activation
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/flash-card',
    name: 'FlashCard',
    component: FlashCard
  },
  {
    path: '/user/login',
    component: UserLogin
  },
  {
    path: '/user/account',
    component: UserAccount
  },

  {
    path: '/courses',
    component: Courses
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
