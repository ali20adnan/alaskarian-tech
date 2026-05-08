import { Router } from "express";
import { query } from "../../lib/db";
import { listProducts } from "../../../../database/products.repository";
import { listRequests } from "../../../../database/requests.repository";

export const overviewRouter = Router();

overviewRouter.get("/stats", async (req, res) => {
  try {
    let statsMap: any = {};
    let activities: any[] = [];
    let recentChats: any[] = [];

    // 1. Fetch Stats (Optional)
    try {
      const dbStats = await query("SELECT * FROM admin_stats");
      statsMap = dbStats.rows.reduce((acc: any, row) => {
        acc[row.key] = { value: row.value, trend: row.trend };
        return acc;
      }, {});
    } catch (e) {
      console.warn("Table 'admin_stats' might be missing, using empty defaults.");
    }
    
    // 2. Fetch Recent Activity (Optional)
    try {
      const dbActivity = await query("SELECT * FROM admin_activity ORDER BY created_at DESC LIMIT 10");
      activities = dbActivity.rows.map(row => ({
        id: row.id,
        user: row.user_name,
        action: row.action,
        location: row.location,
        time: row.created_at
      }));
    } catch (e) {
      console.warn("Table 'admin_activity' might be missing.");
    }

    // 3. Fetch Recent Support Chats (Optional)
    try {
      const dbChats = await query("SELECT * FROM support_chats ORDER BY updated_at DESC LIMIT 5");
      recentChats = dbChats.rows.map(row => ({
        id: row.id,
        user: row.customer_name,
        message: row.last_message,
        status: row.status,
        time: row.updated_at
      }));
    } catch (e) {
      console.warn("Table 'support_chats' might be missing.");
    }

    // Get real counts from JSON as a base (for systems/requests)
    const jsonProductCount = listProducts().length.toString();
    const jsonRequestCount = listRequests().length.toString();

    res.json({
      totalUsers: statsMap.total_users?.value || "0",
      usersTrend: statsMap.total_users?.trend || "0%",
      activeChats: statsMap.active_chats?.value || "0",
      chatsTrend: statsMap.active_chats?.trend || "0%",
      totalProducts: jsonProductCount,
      totalRequests: jsonRequestCount,
      systemHealth: statsMap.system_health?.value || "100%",
      healthTrend: statsMap.system_health?.trend || "Stable",
      activities,
      recentChats
    });
  } catch (error: any) {
    console.error("Critical Overview API Error:", error.message);
    res.json({ 
      error: "Some data could not be loaded",
      totalUsers: "0",
      activeChats: "0",
      totalProducts: "0",
      totalRequests: "0",
      activities: [],
      recentChats: []
    });
  }
});




