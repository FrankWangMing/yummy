import { defineConfig, preview, UserConfig, UserConfigFnObject } from "vite";
import react from "@vitejs/plugin-react-swc";



export default defineConfig((e) => {
  console.log(e)
  const { mode } = e
  let config: UserConfig = {
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
  }
  if (mode == 'development') {
    Object.assign(config,
      {

      }
    )
  }
  if (mode == 'production') {
    Object.assign(config,
      {
        preview: {
          proxy: {
            "/socket.io": {
              target: "http://49.233.216.137:3000",
              changeOrigin: true,
            },
          }
        }
      }
    )
  }
  console.log(config)
  return config
});
