import { ChatMessage } from "../models/ChatMessage.js";

export class ChatbotService {
  constructor() {
    this.foodCategories = {
      pizza: [
        "Pizza Pepperoni",
        "Vegetables Pizza",
        "Margherita Pizza",
        "BBQ Chicken Pizza",
      ],
      burger: [
        "Classic Hamburger",
        "Cheeseburger",
        "Veggie Burger",
        "Chicken Burger",
      ],
      soup: ["Chicken Soup", "Tomato Soup", "Vegetable Soup", "Mushroom Soup"],
      fries: [
        "French Fries",
        "Sweet Potato Fries",
        "Curly Fries",
        "Cheese Fries",
      ],
      fastfood: [
        "Burger",
        "Pizza",
        "French Fries",
        "Chicken Wings",
        "Hot Dogs",
      ],
    };

    this.predefinedResponses = {
      greeting: [
        "Hello! Welcome to Tomato Food Delivery. How can I help you today?",
        "Hi there! Ready to order some delicious food?",
        "Welcome to Tomato! What can I get for you today?",
      ],
      order_status: [
        "I can help you check your order status. Could you please provide your order number?",
        "I'll be happy to track your order. What's your order number?",
      ],
      menu: [
        "Here are our main categories:\n• Pizza 🍕\n• Burgers 🍔\n• Soups 🥣\n• Fast Food 🍟\nWhat would you like to try?",
        "We have a variety of options including Pizza, Burgers, Soups, and more! What are you in the mood for?",
      ],
      help: [
        "I can help you with:\n1. Finding food recommendations\n2. Placing an order\n3. Tracking your delivery\n4. Special dietary requirements\n5. Payment issues\nWhat would you like help with?",
      ],
      error: [
        "I apologize, but I'm having trouble processing your request. Please try again.",
        "Sorry, I couldn't understand that. Could you please rephrase your question?",
      ],
      food_recommendation: [
        "Great choice! Here are some popular options for you:",
        "Here are some delicious options I recommend:",
        "You might enjoy these popular items:",
      ],
      not_found: [
        "I'm sorry, I couldn't find that specific item. Would you like to try something else from our menu?",
        "That item isn't currently available. Can I suggest something similar from our menu?",
      ],
      default: [
        "I'm here to help you find the perfect meal! You can ask me about our menu, specific dishes, or get recommendations. What are you craving?",
      ],
    };
  }

  async processMessage(userId, message) {
    try {
      console.log(`Processing message from user ${userId}: ${message}`);

      if (!userId || !message) {
        throw new Error(
          "Missing required parameters: userId and message are required"
        );
      }

      const userMessage = await ChatMessage.create({
        userId,
        message,
        isBot: false,
      });

      const response = await this.generateResponse(message.toLowerCase());

      const botMessage = await ChatMessage.create({
        userId,
        message: response,
        isBot: true,
      });

      console.log(`Generated response for user ${userId}: ${response}`);

      return {
        userMessage,
        botMessage,
      };
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = await ChatMessage.create({
        userId,
        message: this.getRandomResponse("error"),
        isBot: true,
      });
      return {
        error: true,
        botMessage: errorMessage,
      };
    }
  }

  async generateResponse(message) {
    try {
      // Basic intent detection
      if (this.containsGreeting(message)) {
        return this.getRandomResponse("greeting");
      }

      // Food category detection
      const foodResponse = this.handleFoodQuery(message);
      if (foodResponse) {
        return foodResponse;
      }

      // Other intents
      if (
        message.includes("status") ||
        message.includes("track") ||
        message.includes("where")
      ) {
        return this.getRandomResponse("order_status");
      }
      if (
        message.includes("menu") ||
        message.includes("what") ||
        message.includes("eat") ||
        message.includes("food")
      ) {
        return this.getRandomResponse("menu");
      }
      if (message.includes("help") || message.includes("support")) {
        return this.getRandomResponse("help");
      }

      // Default response
      return this.getRandomResponse("default");
    } catch (error) {
      console.error("Error generating response:", error);
      return this.getRandomResponse("error");
    }
  }

  handleFoodQuery(message) {
    try {
      // Check for specific food categories
      for (const [category, items] of Object.entries(this.foodCategories)) {
        if (message.includes(category)) {
          const randomRecommendation = this.getRandomResponse(
            "food_recommendation"
          );
          const foodItems = items.map((item) => `• ${item}`).join("\n");
          return `${randomRecommendation}\n\n${foodItems}`;
        }
      }

      // Check for specific food items
      const allFoodItems = Object.values(this.foodCategories).flat();
      const matchedFood = allFoodItems.find((item) =>
        message.toLowerCase().includes(item.toLowerCase())
      );

      if (matchedFood) {
        return `Yes, we have ${matchedFood}! Would you like to order it? You can also check out similar items in our menu.`;
      }

      // Check for general food-related words
      const foodKeywords = [
        "hungry",
        "food",
        "eat",
        "meal",
        "dinner",
        "lunch",
        "breakfast",
      ];
      if (foodKeywords.some((keyword) => message.includes(keyword))) {
        return this.getRandomResponse("menu");
      }

      return null;
    } catch (error) {
      console.error("Error handling food query:", error);
      return this.getRandomResponse("error");
    }
  }

  containsGreeting(message) {
    const greetings = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "howdy",
      "hola",
    ];
    return greetings.some((greeting) => message.includes(greeting));
  }

  getRandomResponse(type) {
    try {
      const responses = this.predefinedResponses[type];
      if (!responses || responses.length === 0) {
        throw new Error(`No responses found for type: ${type}`);
      }
      return responses[Math.floor(Math.random() * responses.length)];
    } catch (error) {
      console.error("Error getting random response:", error);
      return "I apologize, but I'm having trouble right now. Please try again in a moment.";
    }
  }

  async getChatHistory(userId, limit = 10) {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }
      return await ChatMessage.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit);
    } catch (error) {
      console.error("Error getting chat history:", error);
      throw error;
    }
  }
}
