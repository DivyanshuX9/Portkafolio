// @lovable.dev/vite-tanstack-config already includes the following - do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this - wrangler.jsonc main alone is insufficient.
const isVercel = Boolean(
  process.env.VERCEL ||
    process.env.NITRO_PRESET === "vercel" ||
    process.env.NODE_ENV === "production",
);

export default defineConfig({
  cloudflare: false,
  vite: {
    assetsInclude: ["**/*.docx"],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("error", (err, _req, res) => {
              if (res && "writeHead" in res && !res.headersSent) {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    error: "Backend service unreachable",
                    message: (err as Error).message || "ECONNRESET",
                  }),
                );
              }
            });
          },
        },
      },
    },
    plugins: [
      nitro({
        preset: isVercel ? "vercel" : undefined,
      }),
    ],
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
