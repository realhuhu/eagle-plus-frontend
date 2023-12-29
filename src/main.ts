import {createApp} from "vue"
import App from "./App.vue"
import router from "./router"
import {createPinia} from "pinia"

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount("#app")
document.body.setAttribute("arco-theme", "dark")

import "animate.css"
import "@/assets/styles/base.css"
import "@/assets/styles/theme.less"
import "@/assets/styles/tailwind.less"
import "@/assets/styles/transition.less"
