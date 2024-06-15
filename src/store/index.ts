import {defineStore} from "pinia"

const today = new Date(new Date().toLocaleDateString()).getTime()

type StoreType = {
  is_mobile: boolean
  dark: boolean
  today: number
  interaction_params: InteractionParams
}
export const UseStore = defineStore("main", {
  state: (): StoreType => ({
    is_mobile: window.innerWidth < 768,
    dark: true,
    today,
    interaction_params: {
      page: 1,
      size: 20,
      start: new Date(today),
      end: new Date(today + 24 * 60 * 60 * 1000 - 1),
      uid: "",
      search: "",
      guard: [0, 1, 2, 3],
      ordering: "-timestamp",
      interaction: [0, 1, 2, 3, 4],
      admin_type: [0, 1, 2],
      medal: "",
      gift: "",
      gift_coin: [0, 1]
    }
  }),
  getters: {},
  actions: {
    toggleTheme() {
      this.dark = !this.dark
      if (this.dark) {
        document.body.setAttribute("arco-theme", "dark")
      } else {
        document.body.removeAttribute("arco-theme");
      }
    }
  }
})
