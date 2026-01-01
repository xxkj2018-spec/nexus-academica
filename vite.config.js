import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 下面这一行是为了解决 GitHub Pages 白屏问题的
  // 这里的 '/nexus-academica/' 对应你的仓库名
  base: "/nexus-academica/",
})