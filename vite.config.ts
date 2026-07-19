import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
        server: env.VITE_API_URL
            ? {
                  proxy: {
                      "/api": {
                          target: env.VITE_API_URL,
                          changeOrigin: true,
                      },
                  },
              }
            : undefined,
    };
});
