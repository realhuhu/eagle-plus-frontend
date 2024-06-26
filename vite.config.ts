import {resolve} from "path";
import {defineConfig} from "vite"
import Vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import IconsResolver from "unplugin-icons/resolver"
import {ArcoResolver} from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import {vitePluginForArco} from "@arco-plugins/vite-vue";

export default defineConfig({
  plugins: [
    Vue({
      script: {
        defineModel: true
      }
    }),
    Icons({
      autoInstall: true,
      compiler: "vue3"
    }),
    viteCompression(),
    vitePluginForArco({
      theme: "@arco-themes/vue-gi-demo"
    }),
    Components({
      dts: "src/types/components.d.ts",
      resolvers: [ArcoResolver({sideEffect: true}), IconsResolver()]
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: "src/types/auto-imports.d.ts",
      resolvers: [ArcoResolver(), IconsResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve(__dirname, "src/assets/styles/base.less")}";`,
        javascriptEnabled: true,
        math: "always"
      }
    }
  }
})
