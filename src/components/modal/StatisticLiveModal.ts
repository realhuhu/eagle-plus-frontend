import StatisticLiveModal from "@/components/modal/StatisticLiveModal.vue";
import { createApp } from "vue";
import router from "@/router";

export const showStatisticLiveModal = (live_id: number, title: string) => {
  const div = document.createElement("div");
  document.body.append(div);
  const app = createApp(StatisticLiveModal, { live_id, title });
  app.use(router).mount(div);
};
