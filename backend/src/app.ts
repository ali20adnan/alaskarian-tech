import express from "express";

import { apiRouter } from "./api/index";

/**
 * Express application: middleware + API only.
 * Static assets and Vite are attached in `server.ts` so this stays easy to test.
 */
export function createApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use("/api", apiRouter);
  return app;
}
