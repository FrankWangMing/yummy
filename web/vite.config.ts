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
        build: {
          rollupOptions: {
            output: {
              manualChunks(id) {
                if (id.includes('node_modules')) {
                  return 'vendor'; // 将 node_modules 打包到 vendor.js 中
                }
                if (id.includes('src/components')) {
                  return 'components'; // 单独拆分组件代码
                }
              }
            },
          },
          cacheDir: 'node_modules/.vite_cache',
          minify: 'esbuild', // 使用 esbuild 进行最小化
          esbuild: {
            worker: true
          },
          target: 'esnext' // 针对较新的浏览器，可以避免转译
        }
      }
    )
  }
  console.log(config)
  return config
});
