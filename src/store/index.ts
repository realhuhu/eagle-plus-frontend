import {defineStore} from "pinia"

type StoreType = {
  is_mobile: boolean
  dark: boolean
}
export const UseStore = defineStore("main", {
  state: (): StoreType => ({
    is_mobile: window.innerWidth < 768,
    dark: true
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
