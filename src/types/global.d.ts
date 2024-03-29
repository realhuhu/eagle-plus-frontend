export {}

declare global {
  type PaginatedResponse<T, R = {}> = {
    count: number
    next: string | null
    previous: string | null
    extra: R
    results: T[]
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
    uid: number
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
}
