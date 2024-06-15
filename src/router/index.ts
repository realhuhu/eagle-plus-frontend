import {createRouter, createWebHistory, type RouteRecordRaw} from "vue-router"

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
      active: "home"
    }
  },
  {
    path: "/interaction",
    name: "interaction",
    component: () => import("@/views/InteractionPage.vue"),
    children: [
      {
        path: "all",
        name: "interaction-all",
        component: () => import("@/components/filter/InteractionAllFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "all",
          interaction_url: "interaction/all",
          interaction_param_fields: ["page", "size", "start", "end", "uid", "guard", "ordering", "search", "interaction"]
        }
      },
      {
        path: "message",
        name: "interaction-message",
        component: () => import("@/components/filter/InteractionMessageFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "message",
          interaction_url: "interaction/message",
          interaction_param_fields: ["page", "size", "start", "end", "uid", "guard", "ordering", "search", "admin_type", "medal"]
        }
      },
      {
        path: "guard",
        name: "interaction-guard",
        component: () => import("@/components/filter/InteractionGuardFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "guard",
          interaction_url: "interaction/guard",
          interaction_param_fields: ["page", "size", "start", "end", "uid", "guard", "ordering"]
        }
      },
      {
        path: "gift",
        name: "interaction-gift",
        component: () => import("@/components/filter/InteractionGiftFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "gift",
          interaction_url: "interaction/gift",
          interaction_param_fields: ["page", "size", "start", "end", "uid", "guard", "ordering", "gift", "gift_coin"]
        }
      },
      {
        path: "entry",
        name: "interaction-entry",
        component: () => import("@/components/filter/InteractionEntryFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "entry",
          interaction_url: "interaction/entry",
          interaction_param_fields: ["page", "size", "start", "end", "uid", "guard", "ordering", "medal"]
        }
      },
      {
        path: "chat",
        name: "interaction-chat",
        component: () => import("@/components/filter/InteractionChatFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "chat",
          interaction_url: "interaction/chat",
          interaction_param_fields: ["page", "size", "start", "end", "uid", "guard", "ordering", "search"]
        }
      },
      {
        path: "award",
        name: "interaction-award",
        component: () => import("@/components/filter/InteractionAwardFilter.vue"),
        meta: {
          active: "interaction",
          interaction_key: "award",
          interaction_url: "interaction/award",
          interaction_param_fields: ["page", "size", "start", "end", "ordering", "search"]
        }
      },
      {
        path: "",
        name: "interaction-redirect",
        redirect: "/interaction/all"
      }
    ]
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/UserPage.vue"),
    children: [
      {
        path: "top",
        name: "user-top",
        component: () => import("@/components/table/UserTopTable.vue"),
        meta: {
          active: "user"
        }
      },
      {
        path: "search",
        name: "user-search",
        component: () => import("@/components/table/UserSearchTable.vue"),
        meta: {
          active: "user"
        }
      },
      {
        path: ":uid",
        name: "user-uid",
        component: () => import("@/components/table/UserDetailTable.vue"),
        meta: {
          active: "user"
        }
      },
      {
        path: "",
        name: "user-redirect",
        redirect: "/user/top"
      }
    ]
  },
  {
    path: "/statistic",
    name: "statistic",
    component: () => import("@/views/StatisticPage.vue"),
    children: [
      {
        path: "session",
        name: "statistic-session",
        component: () => import("@/components/table/StatisticSessionTable.vue"),
        meta: {
          active: "statistic",
          statistic_key: "session"
        }
      },
      {
        path: "period",
        name: "statistic-period",
        component: () => import("@/components/table/StatisticPeriodTable.vue"),
        meta: {
          active: "statistic",
          statistic_key: "period"
        }
      },
      {
        path: "",
        name: "statistic-redirect",
        redirect: "/statistic/session"
      }
    ]
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutPage.vue"),
    meta: {
      active: "about"
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export const safeBack = function (path: string) {
  return !window.history.state.back && path ? router.replace(path || "/") : router.back()
}


export default router
