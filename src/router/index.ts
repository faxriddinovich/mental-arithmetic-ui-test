import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import { Database } from "@/services/indexeddb/database";

import Home from "@/views/home.vue";

import MainResources from "@/views/main-resources.vue";
import OtherResources from "@/views/other-resources.vue";

import Authenticate from "@/views/account/authenticate.vue";
import Account from "@/views/account/account.vue";
import UpdateAccount from "@/views/account/update.vue";
import AccountSessions from "@/views/account/sessions.vue";
import PlatformSettings from "@/views/account/platform-settings.vue";

import Settings from "@/views/settings.vue";

import Course from "@/views/course/course.vue";
import CreateCourse from "@/views/course/create.vue";

import Lesson from "@/views/lesson/lesson.vue";
import CreateLesson from "@/views/lesson/create.vue";

import Scores from "@/views/scores.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      { path: "/", name: "MainResources", component: MainResources },
      {
        path: "/other-resources",
        name: "OtherResources",
        component: OtherResources,
      },
    ],
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
    meta: { requiresAuth: true, roles: ["default", "root", "teacher"] },
    children: [
      { path: "", name: "UpdateAccount", component: UpdateAccount },
      { path: "sessions", name: "AccountSessions", component: AccountSessions },
      {
        path: "platform-settings",
        name: "PlatformSettings",
        component: PlatformSettings,
      },
    ],
  },
  {
    path: "/account/authenticate",
    name: "Authenticate",
    component: Authenticate,
  },
  {
    path: "/courses/:id",
    name: "Course",
    component: Course,
  },
  {
    path: "/course/create",
    name: "CreateCourse",
    component: CreateCourse,
    meta: { requiresAuth: true, roles: ["root", "teacher"] },
  },
  {
    path: "/lessons/:id",
    name: "Lesson",
    component: Lesson,
  },
  {
    path: "/lesson/create",
    name: "CreateLesson",
    component: CreateLesson,
  },
  {
    path: "/scores",
    name: "Scores",
    component: Scores,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const session = await Database.getCurrentSession();

    if (!session) return next({ name: "Authenticate" });

    if (to.meta.roles && !to.meta.roles.includes(session.role))
      return next({ name: "MainResources" });
  }
  next();
});

export default router;
