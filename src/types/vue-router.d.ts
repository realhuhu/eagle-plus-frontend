export {}

declare module "vue-router" {
  interface RouteMeta {
    active?: "home" | "interaction" | "user" | "statistic" | "about"

    interaction_key?: "all" | "message" | "guard" | "gift" | "entry" | "chat" | "award"
    interaction_url?:
      "interaction/all" |
      "interaction/message" |
      "interaction/guard" |
      "interaction/gift" |
      "interaction/entry" |
      "interaction/chat" |
      "interaction/award"
    interaction_param_fields?:
      ["page", "size", "start", "end", "uid", "guard", "ordering", "search", "interaction"] |
      ["page", "size", "start", "end", "uid", "guard", "ordering", "search", "admin_type", "medal"] |
      ["page", "size", "start", "end", "uid", "guard", "ordering"] |
      ["page", "size", "start", "end", "uid", "guard", "ordering", "gift", "gift_coin"] |
      ["page", "size", "start", "end", "uid", "guard", "ordering", "medal"] |
      ["page", "size", "start", "end", "uid", "guard", "ordering", "search"] |
      ["page", "size", "start", "end", "ordering", "search"]

    statistic_key?: "session" | "period"
  }
}
