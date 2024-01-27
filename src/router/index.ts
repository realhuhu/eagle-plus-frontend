import {createRouter, createWebHistory} from "vue-router"
import type {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "home"
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomePage.vue"),
    meta: {
      active: "1"
    }
  },
  {
    path: "/interaction",
    name: "interaction",
    component: () => import("@/views/InteractionPage.vue"),
    meta: {
      active: "2"
    }
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/UserPage.vue"),
    meta: {
      active: "3"
    }
  },
  {
    path: "/statistic",
    name: "statistic",
    component: () => import("@/views/StatisticPage.vue"),
    meta: {
      active: "4"
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router
