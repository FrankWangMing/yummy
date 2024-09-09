import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // 支持全局变量
        // additionalData: `@import "src/**/*.less";`,
        // less.js 的配置
        javascriptEnabled: true,
      },
    },
  },
});
