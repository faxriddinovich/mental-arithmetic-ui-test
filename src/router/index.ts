import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Store from "@/store";
import { acquireAccount } from '@/store/account';
import { acquireGame } from '@/store/game';

import Home from "@/views/home.vue";

import CreateAccount from "@/views/account/create.vue";
import Authenticate from "@/views/account/authenticate.vue";
import Account from "@/views/account/account.vue";
import UpdateAccount from "@/views/account/update.vue";
import AccountSessions from "@/views/account/sessions.vue";
import AccountSubscription from "@/views/account/subscription.vue";
import PlatformSettings from "@/views/account/platform-settings.vue";
import ControlPanelAccounts from "@/views/account/cp/accounts.vue";
import ControlPanelUpdateAccount from '@/views/account/cp/update.vue';
import ControlPanelEvents from "@/views/account/cp/events.vue";
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

import AbacusGameForm from "@/views/games/abacus/form.vue";
import PlayAbacusGame from "@/views/games/abacus/game.vue";

import PlayFlashCardGame from "@/views/games/flash-card/game.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/settings",
    name: "Settings",
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
        meta: { requiresAuth: true, roles: ["default", "root", "teacher"] },
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
        meta: { requiresAuth: true, roles: ["default", "root", "teacher"] },
      },
      {
        path: "platform-settings",
        name: "PlatformSettings",
        component: PlatformSettings,
        meta: { requiresAuth: true, roles: ["root"] },
      },
      {
        path: "accounts",
        name: "ControlPanelAccounts",
        component: ControlPanelAccounts,
        meta: { requiresAuth: true, roles: ["root"] },
      },
      {
        path: "accounts/:id",
        name: "ControlPanelUpdateAccount",
        component: ControlPanelUpdateAccount,
        meta: { requiresAuth: true, roles: ["root"] },
      },
      {
        path: "events",
        name: "ControlPanelEvents",
        component: ControlPanelEvents,
        meta: { requiresAuth: true, roles: ["root"] },
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
    component: BigNumbersGameForm,
  },
  {
    path: "/games/big-numbers/play",
    name: "PlayBigNumbersGame",
    component: PlayBigNumbersGame,
    props: true,
    beforeEnter: (_1, _2, next) => {
      if (!acquireGame().big_numbers) return next({ name: "BigNumbersGameForm" });
      next();
    },
  },
  { path: "/games/abacus", name: "AbacusGameForm", component: AbacusGameForm },
  {
    path: "/games/abacus/play",
    name: "PlayAbacusGame",
    component: PlayAbacusGame,
    beforeEnter: (_1, _2, next) => {
      if (!acquireGame().abacus) return next({ name: "AbacusGameForm" });
      next();
    },
  },

  {
    path: "/games/flash-card/play",
    name: "PlayFlashCardGame",
    component: PlayFlashCardGame,
    beforeEnter: (_1, _2, next) => {
      //if (!acquireGame().abacus) return next({ name: "AbacusGameForm" });
      next();
    },
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
    path: "/courses/:id/update",
    name: "UpdateCourse",
    component: UpdateCourse,
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
  {
    path: "*",
    beforeEnter: (to, from, next) => {
      next({ name: "Home" });
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const routeName = localStorage.getItem("open-url");
  if (routeName) {
    const resolved = router.resolve({ path: routeName });
    if(resolved.resolved.matched.length > 0) {
      localStorage.removeItem('open-url');
      return next(routeName)
    }
  }

  console.error('[router] waiting for sync is not implemented');
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const activeSession = acquireAccount().activeSession;

    if (!activeSession) return next({ name: "Authenticate" });
    if (to.meta?.roles && !to.meta.roles.includes(activeSession.role))
      return next({ name: "Home" });
  }
  next();
});

export default router;
