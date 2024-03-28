import UserInteractionModal from "@/components/modal/UserInteractionModal.vue";
import {createApp} from "vue";
import router from "@/router";

export const showUserInteractionModal = (user: User, params: InteractionParams) => {
  const div = document.createElement("div")
  document.body.append(div)
  const app = createApp(UserInteractionModal, {
    user,
    params,
    unmount() {
      setTimeout(() => {
        app.unmount()
        div.remove()
      }, 1000)
    }
  })
  app.use(router).mount(div)
}

