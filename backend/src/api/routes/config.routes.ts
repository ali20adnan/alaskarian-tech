import { Router } from "express";

import { getSiteConfig, saveSiteConfig } from "../../../../database/index";
import type { SiteConfig } from "../../../../database/index";

export const configRouter = Router();

configRouter.get("/", (_req, res) => {
  try {
    res.json(getSiteConfig());
  } catch {
    res.status(500).json({ error: "Failed to read config" });
  }
});

configRouter.post("/", (req, res) => {
  try {
    const body = req.body as SiteConfig;
    saveSiteConfig(body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update config" });
  }
});
