import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig((mode) => ({
//   plugins: [
//     react(),
//     eslintPlugin({
//       lintOnStart: true,
//       failOnError: mode === "production",
//     }),
//   ],
//   server: {
//     open: true,
//     proxy: {
//       "/api": "http://127.0.0.1:8000",
//     },
//   },
// }));
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  
  return {
    plugins: [
      react(),
      eslintPlugin({
        lintOnStart: true,
        failOnError: isProduction,
      }),
    ],
    server: {
      open: true,
      proxy: {
        "/api": {
          target: isProduction ? "https://capstone-dumblr.onrender.com" : "http://127.0.0.1:8000",
          changeOrigin: true,  // Set this to handle cross-origin issues
          secure: isProduction,  // Set this to true for production if using HTTPS
        },
      },
    },
  };
});
