import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    isBot: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Ensure indexes for better query performance
chatMessageSchema.index({ userId: 1, timestamp: -1 });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
