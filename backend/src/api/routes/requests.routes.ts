import { Router } from "express";
import { listRequests, createRequest, updateRequestStatus, deleteRequest } from "../../../../database/requests.repository";
import { getSiteConfig } from "../../../../database/index";

export const requestsRouter = Router();

// GET all requests
requestsRouter.get("/", (req, res) => {
  try {
    const requests = listRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// POST a new request (from main site)
requestsRouter.post("/", async (req, res) => {
  try {
    const { productId, productTitle, customerName, customerPhone, notes } = req.body;
    
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: "Name and Phone are required" });
    }

    const request = createRequest({
      productId,
      productTitle,
      customerName,
      customerPhone,
      notes
    });

    // Notify Telegram if enabled
    const config = getSiteConfig();
    const tg = config.integrations?.telegram;
    if (tg?.enabled && tg.botToken && tg.chatId) {
      const text = `🆕 *طلب نظام جديد*\n\n` +
                   `📦 *النظام:* ${productTitle}\n` +
                   `👤 *العميل:* ${customerName}\n` +
                   `📞 *الهاتف:* ${customerPhone}\n` +
                   `📝 *ملاحظات:* ${notes || "لا يوجد"}`;
      
      await fetch(`https://api.telegram.org/bot${tg.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tg.chatId,
          text: text,
          parse_mode: "Markdown"
        })
      });
    }

    res.json({ success: true, request });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// PATCH update status
requestsRouter.patch("/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    updateRequestStatus(id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// DELETE a request
requestsRouter.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    deleteRequest(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
});
