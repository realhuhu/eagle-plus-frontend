import fs from "fs";
import cheerio from "cheerio";
import {resolve, join} from "path";
import type {NormalizedOutputOptions, OutputBundle, OutputAsset, OutputChunk} from "rollup"

import Vue from "@vitejs/plugin-vue"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import IconsResolver from "unplugin-icons/resolver"
import {defineConfig} from "vite"
import {ArcoResolver} from "unplugin-vue-components/resolvers";
import viteCompression from "vite-plugin-compression";
import {vitePluginForArco} from "@arco-plugins/vite-vue";


function URLImport(url: string) {
  return {
    name: "url-import",
    writeBundle(options: NormalizedOutputOptions, bundle: OutputBundle) {
      const {dir} = options
      const html = bundle["index.html"] as OutputAsset
      const srcValues: string[] = []

      const $ = cheerio.load(html.source.toString())
      $("[src]").each(function () {
        const src = $(this).attr("src")
        if (src) {
          $(this).attr("src", url + src)
          srcValues.push(src)
        }
      })
      $("[href]").each(function () {
        const href = $(this).attr("href")
        if (href) {
          $(this).attr("href", url + href)
        }
      });

      fs.writeFileSync(join(dir, "index.html"), $.html())

      srcValues.forEach(src => {
        const chunk = bundle[src.slice(1)] as OutputChunk
        chunk.code = chunk.code.replace(
          /import\("\.\/(.+?\.js)"\)/g,
          (_, p) => `import("${url}/assets/${p}")`
        )
        chunk.code = chunk.code.replace("r.href=e", `r.href="${url}"+e`)
        fs.writeFileSync(join(dir, chunk.fileName), chunk.code)
      })
    }
  };
}

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
  build: {
    rollupOptions: {
      plugins: [URLImport("https://dist.realhuhu.com/iying")]
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
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
