import LiveInfoModal from "@/components/modal/LiveInfoModal.vue";
import {createApp} from "vue";
import router from "@/router";

export const showLiveInfoModal = (live_id: number) => {
  const div = document.createElement("div");
  document.body.append(div);
  const app = createApp(LiveInfoModal, {
    live_id,
    unmount() {
      setTimeout(() => {
        app.unmount()
        div.remove()
      }, 1000)
    }
  });
  app.use(router).mount(div);
};
