import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy":
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com",
    },
  },
  // 本番ビルド時の設定も追加
  build: {
    rollupOptions: {
      output: {
        // 外部スクリプトの読み込みを許可
        manualChunks(id) {
          if (id.includes("googleapis.com")) {
            return "external";
          }
        },
      },
    },
  },
});
