import express from "express";
import path from "node:path";

import { apiRouter } from "./api/index";
import { getDataDirectory } from "../../database/index";

/**
 * Express application: middleware + API only.
 * Static assets and Vite are attached in `server.ts` so this stays easy to test.
 */
export function createApp(): express.Express {
  const app = express();
  const uploadsPath = path.join(getDataDirectory(), "uploads");
  app.use(express.json());
  app.use("/uploads", express.static(uploadsPath));
  app.use("/api", apiRouter);
  return app;
}
