import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import examplesConfig from "./scripts/rollup-plugin-config/rollup-plugin-config-json";
import playgroundJson from "./scripts/rollup-plugin-playground/rollup-plugin-playground-json";
import viteImagemin from "vite-plugin-imagemin";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/docs.logic-flow.cn/",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            [
              "playground-preview",
              "playground-project",
              "playground-file-editor",
              "playground-tab-bar",
            ].includes(tag),
        },
      },
    }),
    examplesConfig(),
    playgroundJson(),
    viteImagemin({
      optipng: {
        optimizationLevel: 7,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
  ],
  build: {
    // assetsDir: "./",
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       'playground-elements': ['playground-elements'],
    //     },
    //   },
    // },
  },
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
  },
});
