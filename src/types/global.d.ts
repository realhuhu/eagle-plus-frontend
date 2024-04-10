export { }

declare global {
  type Flat<T> = T extends Item[] ? Item : T extends Item ? Item : never;

  type PaginatedResponse<T, R extends {} = {}> = {
    count: number
    next: string | null
    previous: string | null
    extra: R
    results: T[]
  }

  type Live = {
    title: string
    cover: string,
    timestamp_start: string
    timestamp_end: string
    message_num: number
    chat_price: number
    gift1_price: number
    guard_price: number
    rank: number
  }

  type SimpleUser = {
    uid: number
    current_name: string
  }

  type User = SimpleUser & { current_avatar: string }

  type InteractionParams = {
    page: number
    size: number
    start: Date
    end: Date
    uid: string
    search: string
    guard: number[]
    ordering: string
    interaction: number[]
    admin_type: number[]
    medal: string
    gift: string
    gift_coin: number[]
  }

  type InteractionResponseExtra = {
    price: number
    total: number
  }

  type Message = {
    name_color: string
    level: number
    level_color: number
    level_rank: string
    medal_name: string
    medal_level: number
    medal_color: number
    medal_roomer: string
    medal_room_id: number
    text: string
    text_color: number
    text_emoticon: {
      url: string
      height: number
      width: number
    }
    admin_type: 0 | 1 | 2
  }

  type Guard = {
    guard_name: string
    guard_num: number
    guard_total_price: number
  }

  type Gift = {
    gift_id: number
    gift_name: string
    gift_action: string
    gift_num: number
    gift_coin: 0 | 1
    gift_price: number
    gift_total_price: number
  }

  type Entry = {
    medal_name: string
    medal_level: number
    medal_color: number
    medal_room_id: number
  }

  type Chat = {
    user_level: number
    chat_price: number
    chat_message: string
    chat_icon: string
    chat_image: string
    chat_color: string
    chat_price_color: string
    chat_bottom_color: string
  }

  type Interaction = {
    guard_type: 0 | 1 | 2 | 3
    timestamp: string
    user: User
    message: Message | null
    guard: Guard | null
    gift: Gift | null
    entry: Entry | null
    chat: Chat | null
  }

  type InteractionTable = {
    count: number
    loading: boolean
    extra: InteractionResponseExtra
    interactions: Interaction[]
  }

  type TopItem = {
    user__uid: number
    user__current_name: string
    user__current_avatar: string
    num: number
  }

  type UserInfo = {
    uid: number
    current_name: string
    current_avatar: string
    history_names: { name: string, timestamp: string }[]
    history_avatars: { avatar: string, timestamp: string }[]
  }

  type StatisticPoint = {
    period: str[],
    message_num: (number | null)[]
    entry_num: (number | null)[]
    gift0_num: (number | null)[]
    gift0_price: (number | null)[]
    gift1_num: (number | null)[]
    gift1_price: (number | null)[]
    chat_num: (number | null)[]
    chat_price: (number | null)[]
    guard3_num: (number | null)[]
    guard2_num: (number | null)[]
    guard1_num: (number | null)[]
    guard_price: (number | null)[]
    watch: (number | null)[]
    rank: (number | null)[]
    fans: (number | null)[]
    like: (number | null)[]
    popular: (number | null)[]
  }


  // type Live = {
  //   title: string
  //   cover: string,
  //   timestamp_start: string
  //   timestamp_end: string
  //   message_num: number | null
  //   message_user_num: number | null
  //   entry_num: number | null
  //   entry_user_num: number | null
  //   chat_num: number | null
  //   chat_user_num: number | null
  //   chat_price: number | null
  //   gift0_num: number | null
  //   gift0_user_num: number | null
  //   gift0_price: number | null
  //   gift1_num: number | null
  //   gift1_user_num: number | null
  //   gift1_price: number | null
  //   guard3_num: number | null
  //   guard2_num: number | null
  //   guard1_num: number | null
  //   guard_price: number | null
  //   like: number | null
  //   rank: number | null
  //   watch: number | null
  //   popular: number | null
  //   fans: number | null
  // }
}
