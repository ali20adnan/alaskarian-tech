import { Router } from "express";
import { getSiteConfig } from "../../../../database/index";

export const supportRouter = Router();

supportRouter.post("/message", async (req, res) => {
  try {
    const { message, senderName, senderContact } = req.body;
    
    // Validate inputs
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const config = getSiteConfig();
    const telegramConfig = config.integrations?.telegram;

    // Check if Telegram integration is configured and enabled
    if (telegramConfig?.enabled && telegramConfig.botToken && telegramConfig.chatId) {
      // Build the Telegram message
      const text = `📬 *رسالة جديدة من الدعم الفني*
      
👤 *المرسل:* ${senderName || "غير معروف"}
📞 *التواصل:* ${senderContact || "غير متوفر"}
      
💬 *الرسالة:*
${message}
`;

      // Send to Telegram
      const telegramUrl = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramConfig.chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        console.error("Failed to send Telegram message", await response.text());
        // We still return success to the user, as the chat might still be saved to the DB (if there was one).
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in support message route:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});
