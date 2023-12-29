export {}

declare global {
  type PaginatedResponse<T> = {
    count: number
    next: string | null
    previous: string | null
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
    uid: number | null
    search: string
    guard: number[]
    ordering: string
    interaction: number[]
    admin_type: number[]
    medal: string
  }

  type InteractionTable = {
    count: number
    loading: boolean
    interactions: Interaction[]
  }

  type Interaction = {
    guard_type: 0 | 1 | 2 | 3
    timestamp: string
    user: User
    message: Message | null
    guard: Guard | null
    gift: Gift | null
    entry: Entry | null
  }

  type Message = {
    name_color: string
    level: number
    level_color: number
    level_rank: string
    medal_name: string
    medal_level: string
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
    is_lottery: boolean
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
    medal_level: string
    medal_color: number
    medal_room_id: number
  }

  type Chat = {
    uid: number
    avatar: string
    username: string
    level: number
    privilege_type: 0 | 1 | 2 | 3
    chat_id: string
    chat_name: string
    chat_price: number
    chat_message: string
    chat_icon: string
    chat_image: string
    chat_color: string
    chat_price_color: string
    chat_bottom_color: string
    timestamp_start: number
  }

  type Award = {
    award_name: string
    award_users: {
      num: number
      uid: number
      face: string
      color: number
      uname: string
      level: number
    }[]
    timestamp: number
  }

  type Point = {
    timestamp: number
    count: number
  }

  type Live = {
    timestamp_start: number
    timestamp_end: number | null
  }
}
