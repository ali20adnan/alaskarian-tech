import { Router } from "express";
import { getSiteConfig, getDataDirectory } from "../../../../database/index";
import fs from "node:fs";
import path from "node:path";

export const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  const status = {
    auth: { status: "operational", label: "Auth API", icon: "ShieldCheck" },
    database: { status: "operational", label: "Database", icon: "Database" },
    storage: { status: "operational", label: "File Storage", icon: "HardDrive" },
    search: { status: "operational", label: "Search Engine", icon: "Search" }
  };

  try {
    // 1. Check Database (Site Config)
    const config = getSiteConfig();
    if (!config) {
      status.database.status = "degraded";
    }

    // 2. Check File Storage
    const uploadsPath = path.join(getDataDirectory(), "uploads");
    if (!fs.existsSync(uploadsPath)) {
      status.storage.status = "error";
    }

    // 3. Mock Auth & Search (Since they are internal/simulated for now)
    // In a real app, these would call external APIs
    
  } catch (err) {
    console.error("Health check error:", err);
  }

  res.json(Object.values(status));
});
