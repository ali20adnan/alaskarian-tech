import { Router } from "express";
import { query } from "../../lib/db";

export const healthRouter = Router();

healthRouter.get("/", async (req, res) => {
  try {
    const dbStatus = await query("SELECT label, status, icon FROM system_status");
    
    if (dbStatus.rows.length > 0) {
      return res.json(dbStatus.rows);
    }

    // Default Fallback if DB table is empty
    const defaultStatus = [
      { label: "Auth API", status: "operational", icon: "ShieldCheck" },
      { label: "Database", status: "operational", icon: "Database" },
      { label: "File Storage", status: "operational", icon: "HardDrive" },
      { label: "Search Engine", status: "operational", icon: "Search" }
    ];
    res.json(defaultStatus);
  } catch (err) {
    console.error("Health check database error:", err);
    // Fallback if DB connection fails
    res.json([
      { label: "System", status: "degraded", icon: "Activity" }
    ]);
  }
});

