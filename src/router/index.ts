import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";

import Store from "@/store";
import {SessionStorage} from "@/services/storages/session";

import Home from "@/views/home.vue";

import CreateAccount from "@/views/account/create.vue";
import Authenticate from "@/views/account/authenticate.vue";
import Account from "@/views/account/account.vue";
import UpdateAccount from "@/views/account/update.vue";
import AccountSessions from "@/views/account/sessions.vue";
import AccountSubscription from "@/views/account/subscription.vue";
import PlatformSettings from "@/views/account/platform-settings.vue";
import Accounts from "@/views/account/accounts.vue";
import ManageEvents from "@/views/account/manage-events.vue";
import AccountBlocked from "@/views/account/blocked.vue";

import Settings from "@/views/settings.vue";

import Course from "@/views/course/course.vue";
import CreateCourse from "@/views/course/create.vue";
import UpdateCourse from "@/views/course/update.vue";

import Lesson from "@/views/lesson/lesson.vue";
import CreateLesson from "@/views/lesson/create.vue";

import Scores from "@/views/scores.vue";

import BigNumbersGameForm from "@/views/games/big-numbers/form.vue";
import PlayBigNumbersGame from "@/views/games/big-numbers/play.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      const urlOpen = localStorage.getItem("url-open");

      if (urlOpen) {
        localStorage.removeItem("url-open");
        next(urlOpen);
        return;
      }
      next();
    },
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/account",
    component: Account,
    children: [
      {
        path: "/",
        name: "UpdateAccount",
        component: UpdateAccount,
        meta: {requiresAuth: true, roles: ["default", "root", "teacher"]},
      },
      {
        path: "/account/sessions",
        name: "AccountSessions",
        component: AccountSessions,
      },
      {
        path: "subscription",
        name: "AccountSubscription",
        component: AccountSubscription,
        meta: {requiresAuth: true, roles: ["default", "root", "teacher"]},
      },
      {
        path: "platform-settings",
        name: "PlatformSettings",
        component: PlatformSettings,
        meta: {requiresAuth: true, roles: ["root"]},
      },
      {
        path: "accounts",
        name: "Accounts",
        component: Accounts,
        meta: {requiresAuth: true, roles: ["root"]},
      },
      {
        path: "manage-events",
        name: "ManageEvents",
        component: ManageEvents,
        meta: {requiresAuth: true, roles: ["root"]},
      },
    ],
  },
  {
    path: "/account/authenticate",
    name: "Authenticate",
    component: Authenticate,
  },
  {
    path: "/account/create",
    name: "CreateAccount",
    component: CreateAccount,
  },
  // FIXME: protect this route
  {
    path: "/account/blocked",
    name: "AccountBlocked",
    component: AccountBlocked,
  },
  {
    path: "/games/big-numbers/form",
    name: "BigNumbersGameForm",
    component: BigNumbersGameForm

  },
  {
    path: "/games/big-numbers/play",
    name: "PlayBigNumbersGame",
    component: PlayBigNumbersGame,
    props: true,
    beforeEnter: (to, from, next) => {
      const settings = Store.getters["GameModule/settings"];

      if (!settings)
        return next({name: 'BigNumbersGameForm'});

      to.params.answerAtEnd = settings.answerAtEnd;
      to.params.queue = settings.queue;
      to.params.multiplayerMode = settings.multiplayerMode;
      next();
    }
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
    meta: {requiresAuth: true, roles: ["root", "teacher"]},
  },
  {
    path: "/courses/:id/update",
    name: "UpdateCourse",
    component: UpdateCourse,
    meta: {requiresAuth: true, roles: ["root", "teacher"]},
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
    const activeSession = await SessionStorage.getActiveSession();

    if (!activeSession) return next({name: "Authenticate"});
    if (to.meta?.roles && !to.meta.roles.includes(activeSession.role))
      return next({name: "Home"});
  }
  next();
});

export default router;
