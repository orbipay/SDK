import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendCardCreatedEmail } from "./resend";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/send-card-email", async (req, res) => {
    try {
      const { email, cardName } = req.body;
      
      if (!email || !cardName) {
        return res.status(400).json({ error: "Email and card name are required" });
      }

      const result = await sendCardCreatedEmail(email, cardName);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Email send error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/solana/rpc", async (req, res) => {
    try {
      const heliusRpc = process.env.HELIUS_API_KEY;
      if (!heliusRpc) {
        return res.status(500).json({ error: "Helius RPC not configured" });
      }

      const rpcUrl = heliusRpc.startsWith("http") 
        ? heliusRpc 
        : `https://mainnet.helius-rpc.com/?api-key=${heliusRpc}`;

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Helius RPC error:", error);
      res.status(500).json({ error: "Failed to connect to Helius RPC" });
    }
  });

  return httpServer;
}
