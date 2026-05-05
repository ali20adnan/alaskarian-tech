import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

import { createApp } from "./app";
import { ensureProductsFile, ensureSiteConfigFile } from "../../database/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const FRONTEND_ROOT = path.join(PROJECT_ROOT, "frontend");
const FRONTEND_DIST = path.join(FRONTEND_ROOT, "dist");

function bootstrapPersistence(): void {
  ensureSiteConfigFile();
  ensureProductsFile();
}

async function startServer(): Promise<void> {
  bootstrapPersistence();

  const app = createApp();
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: FRONTEND_ROOT,
      configFile: path.join(FRONTEND_ROOT, "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(FRONTEND_DIST));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(FRONTEND_DIST, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

void startServer();
