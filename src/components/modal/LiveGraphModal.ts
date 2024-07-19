import LiveGraphModal from "@/components/modal/LiveGraphModal.vue";
import {createApp} from "vue";
import router from "@/router";

export const showLiveGraphModal = (live_id: number, title: string) => {
  const div = document.createElement("div");
  document.body.append(div);
  const app = createApp(LiveGraphModal, {
    live_id,
    title,
    unmount() {
      setTimeout(() => {
        app.unmount()
        div.remove()
      }, 1000)
    }
  });
  app.use(router).mount(div);
};
