import { Router } from "express";

import type { ActivityLogEntry } from "../../../../database/index";

export const logsRouter = Router();

logsRouter.get("/", (_req, res) => {
  const entries: ActivityLogEntry[] = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      event: "Admin login",
      user: "Admin Account",
      status: "success",
    },
    {
      id: 2,
      timestamp: new Date().toISOString(),
      event: "Config update",
      user: "Admin Account",
      status: "success",
    },
    {
      id: 3,
      timestamp: new Date().toISOString(),
      event: "Database backup",
      user: "System",
      status: "success",
    },
  ];
  res.json(entries);
});
