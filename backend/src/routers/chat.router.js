import { Router } from "express";
import asyncHandler from "express-async-handler";
import { ChatbotService } from "../services/chatbotService.js";

const router = Router();
const chatbotService = new ChatbotService();

router.post(
  "/send",
  asyncHandler(async (req, res) => {
    const { userId, message } = req.body;
    const response = await chatbotService.processMessage(userId, message);
    res.send(response);
  })
);

router.get(
  "/history/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const history = await chatbotService.getChatHistory(userId);
    res.send(history);
  })
);

router.get(
  "/status",
  asyncHandler(async (req, res) => {
    res.send({ status: "online" });
  })
);

export default router;
