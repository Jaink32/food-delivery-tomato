const chatbotService = require("../services/chatbotService");
const asyncHandler = require("express-async-handler");

const sendMessage = asyncHandler(async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    res.status(400);
    throw new Error("Please provide both userId and message");
  }

  const response = await chatbotService.processMessage(userId, message);
  res.status(200).json(response);
});

const getChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit } = req.query;

  if (!userId) {
    res.status(400);
    throw new Error("Please provide userId");
  }

  const history = await chatbotService.getChatHistory(
    userId,
    parseInt(limit) || 10
  );
  res.status(200).json(history);
});

module.exports = {
  sendMessage,
  getChatHistory,
};
